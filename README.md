## Custom Homepage Widgets for D2L Brightspace

Custom widgets using API calls in JavaScript to help instructors with designing/reviewing courses and downloading course data. A widget is also available for students that allows easier and direct access to frequently used tools within each active course and the current final grade. Alternatively, students can paste code directly into the browser console to see their final grades for all courses.

## Students: Current Semester Courses Widgets

These widgets are designed for the main D2L homepage rather than an individual course, based on the Student/Learner role at the organization level. The widget lists the student's open (active and within the start and end dates) semester courses - for last, this, and next semester - with direct links to each course's homepage, content, assignments, and gradebook as well as when the student last accessed the course. Semester start dates need to be updated in the code and the filters for semesters are based on the course code. 

<img src="https://jenniferlynnwagner.com/img/widgets/3semester-courses.jpg" width="600px" alt="Semester courses widget for student D2L homepage">

The semester and non-credit courses version also includes another button for non-credit courses (such as communities or professional development); sorting options of alphabetical, oldest access and recent access; and the current final grade under the gradebook link.

Add a custom widget to your organization's D2L homepage and check the box to Render in iFrame before pasting in the HTML code for the content of the widget in the source code editor.

## Students: Current Final Grades in Console

Students can paste this code directly into the browser console to display their final grades for all courses.

## Instructors: Course Reminders Widget

Reminders that help to ensure the course is ready for students before the semester begins. The widget displays important information about the course in one location with suggested actions for improvement. The code checks for course status, start/end dates, syllabus in Content, long descriptions in Content, video files uploaded to Manage Files, and grade schemes that include a 4.0 GPA scale.

<img src="https://jenniferlynnwagner.com/img/widgets/reminders.png" width="400" alt="Course Reminders widget">


## Instructors: Course Materials Widget

Simple checks if certain materials have already been created in and/or copied into the course, such as Announcements, Assignments, Content items, Discussion forums, etc. Syllabus in Content checks for the word syllabus in the title of items and modules.

![Course Materials widget](https://jenniferlynnwagner.com/img/widgets/materials.png)

## Instructors: Download Posts Widget

Simple way to download all discussion posts in the course as a CSV file. Just click the button. Feedback message will display below the button when download is successful or if there are no posts in the course.

![Download Posts widget](https://jenniferlynnwagner.com/img/widgets/posts.png)

### How to create custom instructor widgets in D2L for course homepages:

Upload the .js files to Public Files or Manage Files within a course (edit paths in code where necessary). Go to Course Admin, Widgets, and Create Widget in your D2L course. Check the box to Render in iFrame before pasting in the HTML code for the content of the widget in the source code editor. Add release conditions so that only faculty and staff roles at your institution can see the widget. Once the widget is created, add it to your active homepage.

Alternatively, you can upload the HTML files directly to Content and hide them from students rather than creating a custom homepage widget. However, unlike widgets, you will not be able to copy these pages using Course Admin -> Import / Export / Copy Components. The code uses a replace string for the OrgUnitID which will get replaced by the actual ID number of the original course when copying HTML pages in Content.

All the endpoints can be found at the Brightspace API reference website: https://docs.valence.desire2learn.com/reference.html

*The creation of the Course Reminders widget was inspired by the University of Groningen's Course Info widget: https://github.com/rijksuniversiteit-groningen/BrightspaceWidgets*
