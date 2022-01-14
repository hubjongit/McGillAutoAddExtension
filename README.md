# McGillAutoAddExtension

This small project is a Chrome extension tool that automates the "Quick Add" process on McGill's Minerva platform for students attempting to join a course that has limited space availability.

## Installation Instructions
This extension was developed for Google Chrome. Please make sure to have an up-to-date version of Google Chrome available.
1. Within this repository page, click on the green *Code* button near the top and select *Download ZIP*
2. Find the ZIP file in your file browser and unzip it to obtain a folder with all the necessary files
3. Navigate in Google Chrome to the "Extensions" page (More Tools > Extensions **OR** by directly putting *chrome://extensions/* in the address bar)
4. In the upper-right hand corner, enable *Developer mode*
5. Within the newly appearing menu bar, click on *Load unpacked* and select the folder unzipped in Step 2
6. The McGill Course Auto Quick Add Extension should now appear in your extensions, and be directly accessible through the Chrome browswer's top bar (extensions appear to the right of the address bar)
7. Follow the instructions on the small extension window to start using it
8. Good luck! :)

## Warning
The Minerva platform has a built-in limit for the number of course addition requests you can make (approximately >1000). It is for this reason that this extension includes a counter to track the number of times it attempts to add a course. After approximately 5 hours (600 attempts), the extension will automatically stop running to protect your account and avoid issues.
From experience, if your Minerva account is displaying a "lock-out" blocking error, simply follow the instructions in the error (contact the appropriate Service Point) to gain access back (note, repeated overages could result in trouble... beware!)
