## Course Reminders Custom Homepage Widget

This custom homepage widget for D2L Brightspace includes course reminders for instructors and instructional designers when designing or reviewing a course. These reminders will help to ensure that the course is ready for students before the semester begins. Using API calls and JavaScript, the widget displays important information about the course in one location for easier access. Suggested actions and help links are also included for each reminder.

The code checks for course status, start/end dates, syllabus in Content, long descriptions in Content, video files uploaded to Manage Files, and grade schemes that include a 4.0 GPA scale. All the endpoints can be found at the Brightspace API reference website: https://docs.valence.desire2learn.com/reference.html

Create a folder called reminders-widget in Public Files before uploading the files. Or update filesPath in the JavaScript code and script src in the HTML code to your own Public Files or Manage Files path in D2L.

Go to Course Admin, Widgets, and Create Widget in your D2L course. Check the box to Render in iFrame before pasting in the HTML code for the content of the widget in the source code editor. Make sure to add in your institution's help webpage URLs for each reminder. Add release conditions so that only faculty and staff roles at your institution can see the widget. Once the widget is created, add it to your active homepage.

When you navigate to the homepage, the data should display immediately as long as you have the correct permisions. If the API calls are not successful, the placeholder text will display.

*The creation of this widget was inspired by the University of Groningen's Course Info widget: https://github.com/rijksuniversiteit-groningen/BrightspaceWidgets*
