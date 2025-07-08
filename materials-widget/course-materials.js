window.onload = () => {
    // check for Content items and the word syllabus in Content titles
    
        const contentElem = document.getElementById('contentCheck');
        const syllabusElem = document.getElementById('syllabusCheck');
        
        async function checkContent() {
        try {
            const courseData = await fetchNext('/d2l/api/le/1.75/'+ window.orgUnitId + '/content/root/');
            
            if (!courseData) {
                throw new Error('Error fetching Content/root data');
            }
    
            contentElem.innerText = courseData.length > 0 ? "YES" : "NO";
    
                    if (courseData.length > 0) {
            const hasSyllabus = courseData.some(item => item.Title.toLowerCase().includes("syllabus") ||
            item.Structure?.some(content => content.Title.toLowerCase().includes("syllabus"))
          );
    
          syllabusElem.innerText = hasSyllabus ? "YES" : "NO";
        }
        }
        catch (error) {
            console.error('Error fetching Content data:', error);
        }
        }
    
    checkContent();
    
    // check for any announcements, assignment dropboxes, quizzes, discussion forums, grade items, and files
    
        const announcements = '/d2l/api/le/1.75/'+ window.orgUnitId + '/news/'
        const announceElem = document.getElementById('announceCheck');
        const assignments = '/d2l/api/le/1.75/'+ window.orgUnitId + '/dropbox/folders/'
        const assignElem = document.getElementById('assignCheck');
        const quizzes = '/d2l/api/le/1.75/'+ window.orgUnitId + '/quizzes/';
        const quizElem = document.getElementById('quizCheck');
        const discussions = '/d2l/api/le/1.75/'+ window.orgUnitId + '/discussions/forums/';
        const discElem = document.getElementById('discCheck');
        const grades = '/d2l/api/le/1.75/'+ window.orgUnitId + '/grades/';
        const gradeElem = document.getElementById('gradeCheck');
        const files = '/d2l/api/lp/1.46/'+ window.orgUnitId + '/managefiles/';
        const fileElem = document.getElementById('filesCheck');
       
    
        function checkCourse(endpoint, divid, objectArrayKey = null) {
        fetch(endpoint)
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then(filesData => {
            let hasData = false;
    
            if (Array.isArray(filesData)) {
              hasData = filesData.length > 0;
            } else if (objectArrayKey && Array.isArray(filesData[objectArrayKey])) {
              hasData = filesData[objectArrayKey].length > 0;
            } else {
              hasData = Object.keys(filesData).length > 0;
            }
      
            divid.innerText = hasData ? "YES" : "NO";   
            
          })
          .catch(error => {
            console.error('Error fetching data:', error);
          });
        }
        
        checkCourse(announcements, announceElem);
        checkCourse(assignments, assignElem);
        checkCourse(quizzes, quizElem, 'Objects');
        checkCourse(discussions, discElem);
        checkCourse(grades, gradeElem);
        checkCourse(files, fileElem);
    
    
    // check for and concatenate all data when segmented
    
        async function fetchNext(url) {
        let allData = [];
        let nextUrl = url;
        
        while (nextUrl) {
            const response = await fetch(nextUrl);
            if (response.status !== 200) {
                console.info(`All data not available: status code ${response.status}.`);
                return null; 
            }
            const data = await response.json();        
            if (data.Objects) {
                allData = allData.concat(data.Objects);
            } else if (Array.isArray(data)) {
                allData = allData.concat(data);
            } else {
                console.warn('Unexpected data format:', data);
            }
            nextUrl = data.Next || null;
        }
        return allData;
    }
      };
