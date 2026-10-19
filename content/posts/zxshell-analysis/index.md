---
title: Malware Analysis on popular RAT Trojan, Zxshell
description: Malware Analysis on popular RAT Trojan, Zxshell
publishDate: 12 Feb 2023
tags:
- pre-u
pinned: false
draft: false
---

In this project, we analyzed the popular Remote Access Trojan (RAT), Zxshell both dynamically and statically with popular malware analysis tools to uncover what possibly happens behind infected systems.


:::figure
::youtube{id="TuVZkCVDKtQ" title="YouTube video" query="si=pEc35UD_9pXRdaql"}

Watch the video above for the full analysis of the report on the malware.
:::


## About this Project
This project was an assignment for the module ‘Malware Analysis Tools & Techniques’ where we were equipped with basic and advanced skills in analyzing malwares both statically and dynamically. For this assignment, we chose ZxShell, a remote access trojan as our malware to be analyzed.

### Summary of Zxshell Activity
In summary, through our analysis we learned how the malware DLL installs itself within the system to avoid detection. It injects itself into a valid windows process that isn’t used by running through a list of services and runs its using svchost.exe. This way it masks the presence as a legitimate windows service to bypass visual detection. Svchost runs many different services adding to the noise, making it harder to detect. After installation and injecting itself into the system, the ShellMain function runs before the ShellMainThread. The ShellMainThread calls for a function that checks the registry path every 2 seconds to ensure that it hasn’t been modified, or discovered. If it is, the malware would lay low for a bit. To make a connection with the controller, the malware masks its outgoing connection to the by sending a request through the default browser, in most cases internet explorer. Some features of Zxshell includes collecting the information infected computer, a keylogger, connect to a proxy service, access video or display hardware.

## Roles and Contributions
Advanced Static and Dynamic Analysis.

## My Take on this Project
This was an extremely challenging assignment as although we were taught on how to use the tools and equipped with some of the skills, it was our first time dealing with a whole packaged malware used to target legitimate individuals and organizations. Researching into this malware was like dealing with a black box problem and it built a lot of perseverance in myself due to the amount of research it needed and tenacity it required. Despite how difficult this assignment was, I left this module feeling even more inspired and interested in Malware Analysis as I loved the challenge it gave and the occasional ‘Wonka’ moments I had. It was a fantastic introduction and insight into malware analysis.

## Achievements
Grade: A

## Special Thanks
**Team Members**
: Lai Yo Ming


## Gallery

![Gallery image 1](./6e002dd29749.png)

![Gallery image 2](./55115ff12172.png)
