window.addEventListener('load', (loadEvent) => {
 
// check course status and start/end dates (Course Admin -> Course Offering Information)
    
        const statusElem = document.getElementById('statusCheck');
        const statusImg = document.getElementById('statusImg');
        const statusStart = document.getElementById('startDate');
        const statusEnd = document.getElementById('endDate');
          
    async function checkCourseInfo() {
            try {
                const response = await fetch('/d2l/api/lp/1.43/courses/' + window.orgUnitId);
                if (!response) {
                    throw new Error('Error fetching course status/dates');
                }  
            
            const courseData = await response.json();

            if (courseData.IsActive) {
                statusElem.innerText= "ACTIVE. This course is visible to students in their My Courses list. Students will have access to the course between the start and end dates or if no dates are set.";
                statusImg.className = 'fa fa-unlock green';
            } else { 
                statusElem.innerText = "NOT ACTIVE. Please make this course active so it is visible to students in their My Courses list, then students will have access to the course between the start and end dates or if no dates are set.";
                statusImg.className = 'fa fa-lock red';
            }
            
            const startDate = courseData.StartDate === null ? null : new Date(courseData.StartDate);
                if (startDate !== null) {
                    statusStart.innerText = getDate(startDate);
                }
                else { 
                    statusStart.innerText = 'No start date set';
                }                 
                    
            const endDate = courseData.EndDate === null ? null : new Date(courseData.EndDate);
                if (endDate !== null) {
                    statusEnd.innerText = getDate(endDate);
                }
                else {
                    statusEnd.innerText = 'No end date set';
                }

        } catch (error) {
            console.error('Error fetching Course Offering Information data:', error);
        }
    }

    checkCourseInfo();
    
// display start/end dates in American format with time zone

        function getDate(date) {
            return date.toLocaleString('en-US', 
            { weekday: 'long',
            month: 'long',
            year: 'numeric',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            timeZoneName: 'long', 
            });
        }
          
// check for syllabus in titles AND long module descriptions

    const syllabusElem = document.getElementById('syllabusCheck');
    const syllabusImg = document.getElementById('syllabusImg');
    const descElem = document.getElementById('descCheck');
    const descImg = document.getElementById('descImg');

    async function checkContent() {
    try {
        const contentData = await fetchNext('/d2l/api/le/1.75/' + window.orgUnitId + '/content/root/');
        
        if (!contentData) {
            throw new Error('Error fetching Content/root data');
        }
        
        // check for syllabus in module titles or topic titles

        if (contentData.some(item => item.Title.toLowerCase().includes("syllabus") || item.Structure.some(content => content.Title.toLowerCase().includes("syllabus")))){
            syllabusElem.innerText = "This course includes a Content module or item with the word syllabus in the title, which is clearly labeled for students. Please ensure that it is an accessible webpage or Word document.";
            syllabusImg.className = 'fa fa-check-circle green';
        } else { 
            syllabusElem.innerText= "This course does NOT include a Content module or item with the word syllabus in the title. Make sure to add your syllabus as an accessible webpage or Word document. Please do not upload it to the Overview area or any description areas.";
            syllabusImg.className = 'fa fa-exclamation-triangle orange';
        }    

        // check for long descriptions

        if (contentData.some(item => item.Description.Text.length > 500)) {
            descElem.innerText = "This course includes at least one long module description. Please ensure that all course materials are created as accessible webpages or Word documents in Content and are not added to the description areas.";
            descImg.className = 'fa fa-exclamation-triangle orange';
        } else { 
            descElem.innerText = "This course includes short or empty descriptions on modules in Content. Please continue to avoid adding course materials to description areas and only add them as accessible webpages and Word documents in Content.";
    	    descImg.className = 'fa fa-check-circle green';
        }
    } catch (error) {
        console.error('Error fetching Content data:', error);
    }
}

    checkContent();
    
    
// check for video files in Manage Files
    
        const videoElem = document.getElementById('videoCheck');
        const videoImg = document.getElementById('videoImg');
          
    async function checkFiles() {
            try {
                const filesData = await fetchNext('/d2l/api/lp/1.46/' + window.orgUnitId + '/managefiles/');
                if (!filesData) {
                    throw new Error('Error fetching files data');
                }       

            if (filesData.some(item => item.Name.toLowerCase().includes(".mp4") || item.Name.toLowerCase().includes(".mov"))){
                videoElem.innerText= "At least one .mp4 or .mov video file was found in Manage Files in this course. Please upload videos to MediaSpace, proofread the captions, and embed them into D2L instead of uploading them directly to D2L courses.";
                videoImg.className = 'fa fa-exclamation-triangle orange';
            } else { 
                videoElem.innerText = "No .mp4 or .mov video files were found in Manage Files in this course. If you plan to add videos, please upload them to MediaSpace, proofread the captions, and embed them into D2L instead of uploading them directly to your course.";
                videoImg.className = 'fa fa-check-circle green'; 
            }   
    
        } catch (error) {
            console.error('Error fetching Manage Files data:', error);
        }
    }

    checkFiles();
    
// check for grade scheme with GPA symbols
    
        const gpaElem = document.getElementById('gpaCheck');
        const gpaImg = document.getElementById('gpaImg');
         
        
        async function checkSchemes() {
            try {
                const schemesData = await fetchNext('/d2l/api/le/1.75/' + window.orgUnitId + '/grades/schemes/');
                
                if (!schemesData) {
                    throw new Error('Error fetching GPA scheme data');
                }   
        
            if (schemesData.some(scale => scale.Ranges.some(range => range.Symbol === "4.0" || range.Symbol === "3.5" || range.Symbol === "3.0"))){
                gpaElem.innerText= "At least one grade scheme with GPAs was found in this course. Please ensure to apply this scheme to the Final Calculated (or Adjusted) Grade so that you can submit final grades directly from D2L.";
                gpaImg.className = 'fa fa-check-circle green';
            } else { 
                gpaElem.innerText = "No grade schemes with GPAs were found in this course. Please ensure to create and apply a 4.0 GPA scheme to the Final Calculated (or Adjusted) Grade so that you can submit final grades directly from D2L.";
                gpaImg.className = 'fa fa-exclamation-triangle orange';
            }   
        } catch (error) {
            console.error('Error fetching Schemes data:', error);
        }
    }
            
    checkSchemes();

// loop to return all data from multiple pages instead of just first page

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

});
