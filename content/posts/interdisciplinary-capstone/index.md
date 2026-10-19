---
title: Pre-U Final Year Interdisciplinary Capstone
description: pre-u capstone
publishDate: 21 Aug 2023
tags:
- pre-u
pinned: false
draft: false
---

For our final year interdisciplinary capstone project, we were paired with an industry client and were approached with the problem of remotely controlling the on-screen displays of Android televisions.

## About this Project
As an Interdisciplinary Capstone project, we were paired with an industry client and were approached with the problem of remotely controlling the on-screen displays of Android televisions. At present, the client had limitations with its current deployment setup due to it being inside their network and restricted by their firewall which prevented them from remotely accessing their internal devices easily. As such, they requested for the telegram application to be used to control their TVs which will not be restricted by their current network setup. Thus the team looked into the Telegram Bot API to act as an intermediary between the user and the android television(s).

After much planning, research and discussion as a team we proposed to a client with a viable solution, one that was not exactly the way that they imagined, but still made use of telegram. The main components of the solution consisted of a Telegram chat bot, Telegram Web Application and an Android app (The architecture of the solution can be seen above). There were many considerations when we were designing this architecture, but we mainly wanted to deliver the following: easy to control, secure, fast, accessible; and the components above could help us achieve all that (kinda).

The Telegram Web Application (Web App) would allow us to provide a user interface that the user can schedule/create a display for a TV, the Telegram chatbot would be for management features (eg; add TVs) and lastly the android application would do all the displaying on the TVs as long as the app was open. There were also some other features we added to the web application (as per requested by the client), such as allowing users to create simple display images from the Telegram Web App itself with the help of the Fabric.Js library.

Other considerations also came into mind when designing this architecture. For example, the No-SQL database. SQL was initially considered due to its vertical scalability that would enable data to be kept consistently, however as it is extremely rigid with defined columns, data types, and relations, it makes changing data for implemented feature difficult. NoSQL was then considered as the team would not be limited by the database schema. Changes can be easily made as its scales well horizontally. Information also does not have to be strictly defined from the beginning, making implementation of additional features easy. Considering how the data we were dealing with did not require complex relations, we eventually settled on a No-SQL cloud database, MongoDB.

## Roles and Contributions
**Technical Lead, Backend Developer, Android Developer, Database Manager.**

As this was an interdisciplinary project working with Business & Accountancy (BA) students, I was the lead for ICT’s side, frequently communicating our ideas with them. Having the expertise in backend web development, I also handled all of the backend and database for the web application as well as the android app for displaying. I also directed a huge part of the UI/UX in the web app’s front end which my partner, Celsius, was creating.

## My Take on this Project
This was the first time I worked on an Interdisciplinary project in ICT where we teamed up with students from the School of BA (Alicia and Hannah) to complete a project for a client. Being the Technical Lead was challenging but fruitful as I had to frequently communicate the direction of our project to individuals not in tech and unfamiliar with a lot of the stuff we do in ICT. At first it was difficult as dropping tech terms was a norm to me, but being the lead for ICT’s side meant it was my responsibility to bring across my ideas and thoughts in a way that non technical people could understand and it challenged me to put myself in their perspective and distill technical concepts into more straightforward language, shedding unnecessary jargon and intricacies. I happened to also find myself understanding my basic concepts more through their questions.

Working with business studies students has opened my perspective more to the world outside of tech, showing me that when people of disciplines and perspectives work together it can create a more well rounded and overall better solution. This interdisciplinary capstone was definitely an experience not everyone got and I’m appreciative for. If there comes another opportunity to participate in an interdisciplinary project again, I would be sure to take it up.

_(Note: Fewer pictures and No links are provided to the application/repository as it is maintained confidential for security reasons)_

## Achievements
Grade: A+

## Special Thanks

**Industry Client**
: Mr Wong Puen Suen, Mr Dennis Po (AIDC Pte Ltd)

**Team PB&J**
: Celsius Chia (School of Infocomm and Technology), Hannah Chew &  Alicia Lie (School of Business and Accountancy)

**Mentors**
: Mr Ben Low Kheng Hian

**QA (Quality Assurance)**
: Foo Meng




## Gallery

![Gallery image 1](./d7ccec2e5d91.png)

![Gallery image 2](./31d1354c91cb.png)

![Gallery image 3](./4b2cbe5212d2.png)

![Gallery image 4](./3986feedfb68.png)

![Gallery image 5](./ab6b60e65442.png)
