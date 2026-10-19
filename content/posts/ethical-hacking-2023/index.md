---
title: Ethical Hacking with Log4shell 
description: Exploitation & Post Exploitation
publishDate: 15 Aug 2023
tags:
- pre-u
pinned: false
draft: false
---

An ethical hacking project where we demonstrated a possible use case scenario with the Log4j vulnerability. Building the scenario from the ground up, we set up realistic virtual test environments and performed skills from enumeration to post exploitation while making plausible assumptions along the way. 

## About this Project
In this project, we demonstrated exploitation and post exploitation scenarios based on a use case created for an assignment under the Ethical Hacking module. The assignment built to simulate a possible real life scenario of a breach that can occur from vulnerabilities left unpatched or unfixed by organizations.


### Use Case & Scenario

:::figure
![Desktop View](./caec6288e1b9.png)

Network diagram of use case replicated on vmware
:::


 Amid the Covid-19 pandemic, Gary, a disgruntled ex-employee of QUASO Pte Ltd, discovers the company's security negligence. The GoFinance website, essential for financial services, is vulnerable due to an unpatched Log4j zero-day exploit. Fueled by resentment, Gary exploits this vulnerability to infiltrate QUASO's internal FTP server, aiming to retrieve crucial documents. His actions underscore the severe risks organizations face when overlooking security measures, endangering sensitive data and assets.

The exploit can be broken down into 3 main sections. Starting with the Web server exploitation using Log4shell, followed by the pivoting to the FTP server using Chisel and lastly gaining access into an FTP server with Hydra’s brute forcing.

### Web Server Exploitation
In our use case we exploited the Log4j shell to gain access into the web server of the company first. So what is Log4j (Log4shell)?
![Desktop View](./3f66f97be275.png)
 Log4j is a widely used Java logging framework, favored by services like iCloud and Amazon, offering developers control over log messages for monitoring and debugging. However, the framework faced a critical vulnerability known as Log4Shell (CVE-2021-44228) in 2021, allowing unauthenticated remote code execution. Exploiting Log4j's "JNDI lookup" feature, attackers could insert malicious log messages, posing a severe threat due to Log4j's widespread use in various software. This vulnerability attracted ransomware attackers, turning Log4j into a weapon for global exploitation. So using Log4shell, we conducted a simple demonstration with the help of a POC[^log4shell-poc] application to gain access into my Parrot server hosted (victim).

### Pivoting to FTP Server
After gaining access to the server with Log4j, we would like to pivot to a different IP address in the same subnet with the help of Chisel, assuming that Gary knows the existence of the server and discovers the port with some enumeration. 


:::figure
![Desktop View](./05a612bc35d2.png)

Pivoting into a different IP address on the same subnet with Chisel
:::


Chisel[^chisel] is a server client model that allows us to create a TCP tunnel between our kali and webserver transported over HTTP and secured via SSH. With Chisel, we can set up a reverse local tunnel that pivots connection from our attacker through a local port 2121 of the client system to be forwarded to the FTP server via the Chisel Server. Basically with chisel, we remove the need of going through the Log4j vulnerability opening.

Gaining access to FTP Server: Finally, with Hydra we can brute force the ftp system through the tunnel with have created to gain full access into the FTP server.


:::figure
![Desktop View](./fce5339df6fb.png)

Brute forcing into the FTP server with Hydra on Kali
:::


### Post-Exploitation
For post exploitation, I conducted 2 activities. First being SSH cracking and persistence, and Secondly being Gaining RCE access using LFI. I will only be talking more about the former.


:::figure
::youtube{id="_7C8T74Rfio" title="YouTube video" query="si=E41X5jYOkAMbgC5T"}

Watch the video above for the full demonstration on post exploitation (no sound is included as it was presented live).
:::


 For this post exploit, we find that ssh is open to our ftp server with a key. Looking back into our ftp server, we notice that our ftp server has the files we need but we cant get yet as we’re still on the command port (21) and not the data port (20 / random). This becomes troublesome as currently our connection to the ftp server is pivoting via the web server, not accessed directly. We could consider intercepting the traffic and altering it while using another local pivot but chisel is already acting as a proxy. 
  ![Desktop View](./c93a8fc21e3c.png)
 
 So the solution? Instead of creating a reverse local tunnel using chisel, we will use a reverse dynamic SOCKS proxy instead. 
 Using a dynamic socks proxy, we can listen to multiple ports at the same time, allowing our ftp data connection to go through since it is no longer just listening to a single port. The requests sent now are also sent as if it came from our pivot. With the new connection, we can retrieve the SSH keys in the FTP server and crack the keys using John the Ripper. Once the keys are cracked, we can access the server via ssh. Lastly, to maintain persistence, we can use Dnscat2[^dnscat2] to perform dnstunneling.
  ![Desktop View](./a24c2e704f42.png)



## Roles and Contributions
In this project, I planned most and executed most of the Exploitation phase by myself (team portion) and conducted 2 post exploitation activities (individual portion)

## My Take on this Project
This project was by far the toughest assignment given in Ngee Ann. Not only did we have to create the scenario, all environments and setups had to be created from scratch to demonstrate their vulnerabilities. This meant a lot of time was spent figuring out how to put the vulnerability in the web server, set up the VM network configurations, before finding out how to exploit them and getting tools to work. 

The biggest regret I had on this assignment was not being able to figure out how to do Tunneling to a different IP (not of the same subnet). Given the time I would give that technique a shot again. However this project/assignment was a valuable experience that definitely brought me back to my fundamentals and threw me into the world of ethical hacking, forcing me to build from the ground up.

End. 

## Special Thanks
**Team Members**
: Lai Yo Ming

[^log4shell-poc]: Log4shell POC by kozmer: <https://github.com/kozmer/log4j-shell-poc>
[^chisel]: Chisel by jpillora: <https://github.com/jpillora/chisel>
[^dnscat2]: dnscat2 by iagox86: <https://github.com/iagox86/dnscat2>

