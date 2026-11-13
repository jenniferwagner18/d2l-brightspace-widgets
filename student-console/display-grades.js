// Log into D2L Brightspace, open your browser's console, and run the following code
// to display all of your current final grades for all of your courses.

(async () => {
  // ===== SETTINGS: edit these if your institution uses different role names =====

  const ALLOWED_ROLES = ["Student", "Learner"];
  
  // TIP: You may see red "404 (Not Found)" lines in the console. These are normal
  // for courses without a released grade and don't affect the results.
  // ==============================================================================

  let LP = "1.49";
  let LE = "1.82";

  const allowedRolesLower = ALLOWED_ROLES.map(r => r.toLowerCase());

  async function getLatestVersion(productCode) {
    const response = await fetch(`/d2l/api/${productCode}/versions/`);

    if (!response.ok) {
      throw new Error(
        `Could not load ${productCode.toUpperCase()} versions (HTTP ${response.status}).`
      );
    }

    const data = await response.json();

    const entry = Array.isArray(data)
      ? data.find(v => v.ProductCode === productCode)
      : data;

    if (!entry || !entry.LatestVersion) {
      throw new Error(`No LatestVersion found for ${productCode.toUpperCase()}.`);
    }

    return entry.LatestVersion;
  }

  async function getAllEnrollments() {
    const baseUrl = `/d2l/api/lp/${LP}/enrollments/myenrollments/?orgUnitTypeId=3`;
    let items = [];
    let url = baseUrl;
    let pages = 0;

    while (url && pages < 50) {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Could not load enrollments (HTTP ${response.status}).`);
      }

      const page = await response.json();
      items = items.concat(page.Items || []);
      pages++;

      url = page.PagingInfo && page.PagingInfo.HasMoreItems && page.PagingInfo.Bookmark
        ? `${baseUrl}&bookmark=${encodeURIComponent(page.PagingInfo.Bookmark)}`
        : null;
    }

    return items;
  }

  console.log("Loading your Brightspace courses and grades...");

  try {
    [LP, LE] = await Promise.all([
      getLatestVersion("lp").catch(() => LP),
      getLatestVersion("le").catch(() => LE)
    ]);

    const allItems = await getAllEnrollments();

    const courses = allItems
      .filter(item =>
        item.Access.CanAccess &&
        allowedRolesLower.includes(
          (item.Access.ClasslistRoleName || "").toLowerCase()
        )
      )
      .map(item => ({
        name: item.OrgUnit.Name,
        id: item.OrgUnit.Id
      }))
      .sort((a, b) =>
        a.name.localeCompare(b.name, undefined, {
          sensitivity: "base"
        })
      );

    if (!courses.length) {
      const rolesFound = [
        ...new Set(
          allItems
            .filter(item => item.Access.CanAccess)
            .map(item => item.Access.ClasslistRoleName)
            .filter(Boolean)
        )
      ];
      console.log("No eligible courses found.");
      console.log(`Role names currently allowed: ${ALLOWED_ROLES.join(", ")}`);
      console.log(
        `Role names found in your enrollments: ${rolesFound.join(", ") || "(none)"}`
      );
      console.log("Update ALLOWED_ROLES at the top of the script and run it again.");
      return;
    }

    const results = await Promise.all(
      courses.map(async course => {
        try {
          const response = await fetch(
            `/d2l/api/le/${LE}/${course.id}/grades/final/values/myGradeValue`
          );

          if (!response.ok) {
            return { Course: course.name, "Current Grade": "Not yet released" };
          }

          const data = await response.json();

          return {
            Course: course.name,
            "Current Grade": data.DisplayedGrade || "Not yet released"
          };
        } catch {
          return { Course: course.name, "Current Grade": "Not yet released" };
        }
      })
    );

    const tableData = {};
    results.forEach((row, index) => {
      tableData[index + 1] = row;
    });

    console.table(tableData);
    console.log(`Total courses that you can access: ${results.length}`);
    console.log(
      'Grades shown are what your instructors have released and may not be final. "Not yet released" means no grade is available to you yet.'
    );

  } catch (error) {
    console.error("Unable to retrieve grades:", error);
    console.log(
      "Make sure you are logged into Brightspace and on your institution's Brightspace site."
    );
  }
})();
