---
title: Understanding Hand Mixers and Induction Cookers
description: Understanding Hand Mixers and Induction Cookers
publishDate: 31 May 2024
tags:
- volunteering
pinned: false
draft: false
---

Recently, I've joined Repair Kopitiam as a volunteer repair coach _(partly because I think their logo very cute HAHAH)_, and this May was my first event where we have residents bringing in their broken items for repair! During my 4 hours spent there, I dealt with 2 different appliances: **a Hand Mixer & Induction Cooker**, which were pretty complicated fixes and sadly weren't a success... So I decided to write a blog post after doing some additional research, to collate my learnings and bring you through our attempt process. You're reading it right now! Yay!

**Disclaimer: I do not come from an engineering background and get most of my information from research. If there are any discrepancies with the information conveyed, please contact me on my socials, or drop me and email!**

## The Induction Cooker
The first appliance that I worked with was an induction cooker that wouldn't turn on. To troubleshoot such an issue, we start from the very source: The 3-pin plug. 

### Baby steps..baby steps.

Starting with the power source of the appliance is crucial when something isn't turning on. Often times it could be the plug fuse blowing to save the device from actually catching on fire. Then how can we check such connections using the multimeter?

That's simple. 
- For direct wired connections that can be accessed, we can use the Ohm setting with the lowest resistance to check its connection directly from plug to the wire end.
- For connections that cannot be reached, we can use the NCV (Non-Contact Voltage Detection) on the multimeter instead.

Unfortunately, we tested the the power cable and found it to be working perfectly.
We then proceeded to test other components of the device after reopening it and were faced with the PCB, Heating elements and other janky stuff which left us stumped even till the end. 


:::figure
![Desktop View](./9f62465f164e.jpeg)

Full screen width and center alignment
:::


### Never gonna give you up, never gonna let you down~

It was after a while when I moved on to the hand mixer which I will talk about later, but let us discuss the possible ways we could've troubleshooted the different components on the pcb and inside an induction cooker.

I did a simple google search on fiixing induction cookers and found this video in indonesian by **JM Tutorial** to be very informative. He even has chickens in the background that go PORPORKEH so plus points+++++!!!

::youtube{id="ADRXFUh6e2M" title="YouTube video" query="si=zGCKvxyOfNbr7a10"}

Here is the video summarised:
_(idk indonesian so there might be some inaccuracies with my observations oops)_
1. He tested the connection between the fuse first and found it to be blown, possibly from a short circuit.
2. Then, he tested AC/DC connection directly without the fuse, using the multimeter and there was continuity. So that was fine.
3. He then tested the circuit between the transistors of the heatsink _(at this point im just guessing everything he's saying)_
4. He then desoldered it to take a closer look

#### Troubleshooting an IGBT
The component on the left _JT020N135WDD_ is actually a Insulated Gate Bipolar Transistor (IGBT).


:::figure
![Desktop View](https://www.mouser.sg/images/marketingid/2019/img/174271537.png?v=012624.0845)

How an IGBT looks like. It has 3 prongs for emitter, gate and collector.
:::


> In an induction cooker, IGBTs are typically used in the power conversion stage to control the flow of electricity through the induction coil, thereby regulating the heating power applied to the cooking vessel. They play a crucial role in converting the DC power from the input source into high-frequency AC power that creates the magnetic field responsible for induction heating. ~ChatGPT

To learn how to troubleshoot an IGBT to check if its working this video by Haseeb Electronics is detailed. 

::youtube{id="-etZANMs9hU" title="YouTube video" query="si=RMtcwVW5qC_cCNpO"}

#### Troubleshooting a Bridge Rectifier

The other component that he replaced was the _KBJ406G_ Bridge Rectifier on the right.
Christopher's Factory explains it really well [here](https://youtu.be/NuNJGY97KuE?si=VNJJadO843Sn9Li7)  in under 2 minutes. 


:::figure
![Desktop View](https://mm.digikey.com/Volume0/opasdata/d220001/medias/images/4846/31_31-KBP.jpg)

How a a bridge rectifier could look like. Other variations that look different still pretty much work the same, with four diodes pointing in one direction.
:::


To troubleshoot a Bridge Rectifier to check if its working this video by learnelectonics is detailed. 
::youtube{id="K-oNaQvMQco" title="YouTube video" query="si=C4B9F4ck0cELWpfM"}

 After JM changed both components by mutating another working part, JM tests the power to now work. Wow! Almost like magic. 

### The End..?

What JM Electronics showed may not have been our issue, but watching him troubleshoot a fauly induction cooker made me understand more about the different components lying inside the machine that converts electricity to heat.

## The KitchenAid 9 Hand Mixer
 After I have given up looking at the induction cooker with the other volunteers, I decided to move on to another project that had fewer eyes. A nice lady brought in her KitchenAid 9 Hand Mixer and explained that her appliance stopped working after turning it on. She was using it for only less than 5 mins before the power to her mixer cut off. You know what this smells like? A broken fuse.

### Something smells funky..

![Desktop View](./524d3b07f5cb.jpeg)

Thankfully, the volunteers that started working on the the hand mixer first have already dismantled the appliance before I joined _(They really did all of that hard work)_, and have troubleshooted the power cable using the multimeter like explained above. We soon found a ceramic 25A fuse on the main board connected to the motor, and after much testing using the Ohm setting of the multimeter it is safe to say that is where the power cut off. 

![Desktop View](./6304dc57eda6.jpeg)

But what exactly caused the fuse to go bust? To see it happen in real time, we desoldered the ceramic fuse and soldered a 25A Glass Fuse back and powered on the hand mixer. That part was honestly dangerous, but the motor of the hand mixer sparked and a burning smell was emitted even though we quickly switched it off after a second. 

![Desktop View](./7bdecbe3e461.jpeg)

**There was definitely something wrong with the motor.**

### What could've possibly gone wrong?
At that point, we were pretty confident that the problem lied with the motor inside the hand mixer. Since the spark and burning occurred at the brushes of the motor and we have tested the diodes under the PCB relay of the main board to be working fine.

With close to no experience in mechanical engineering, google has always been my best friend.  I found out that the KitchenAid 9 Hand Mixer uses a **Standard Universal Motor** and the segment that sparked was at **commutator and carbon brush** of the motor. 


:::figure
![Desktop View](./0fe6865d29f6.png)

Image by HyperPhysics Concepts
:::


Some sparking in a brush type motor is normal[^Carbon-Motor-Sparking] but excessive sparking could be due to brush wear or a dirty commutator.

In our case, we tried cleaning the commutator without disassembly and resoldered a new fuse to the board, but it wasn't sufficient and sparked again. At this point, replacing the entire universal motor would be easier. However for future references I have found a [Brush Wear Guide](https://evmc2.wordpress.com/wp-content/uploads/2013/05/brushwearguide.pdf) to be informative and rather helpful.

:::tip
Understanding how the universal motor works with electromagnetism is great too and if you would to understand more about its inner workings, I found this [video](https://youtu.be/-qS85aIvleQ?si=UxYk7JBQ_78eVhnz)  by Matthias Wandel to be very helpful.  (It also explains why such motors arent used on long powered devices like fridges and air-conditioners, induction motors are used instead)
:::

### Other shorting tests on motor
If the brush contact and grime isn't the issues, there are also other shorting tests that could be performed on a motor like this to check for internal shorts, such as testing the resistance between the commutator bars both 180° and adjacent. I found this guide on youtube to be straightforward and simple.
::youtube{id="lmjFzukDhqI" title="YouTube video" query="si=Ody_hQ4LJothzDh6"}

## Final words before I dip

This workshop was definitely more rewarding than I expected even if our attempts at fixing the broken appliances were not successful. In such a short period of time I managed to pick up troubleshooting methods from my fellow volunteers and learned a lot more on the multimeter. I love engineering, and spending time uncovering the unknown especially for the community can be so rewarding in this field. I cant wait to attend the next workshop in June! Hope to see yall there~

PS: Since you've reached the end.. I greatly appreciate any form of feedback for my writing, as I constantly try to improve my documentation skills with each post. Do not hesitate to contact me with ur suggestions/improvements!

[^Carbon-Motor-Sparking]:<https://forum.allaboutcircuits.com/threads/motor-carbon-brush-sparking-why-it-happens-and-how-can-i-fix-it.165109/#:~:text=Some%20sparking%20at%20the%20brushes,dust%20between%20the%20commutator%20segments.>

## Gallery

<div class="image-grid">

![Gallery image 1](./7ba6746ac0f1.jpeg)

![Gallery image 2](./e28ffd781cd4.jpeg)

</div>
