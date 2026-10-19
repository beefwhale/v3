---
title: Why you should pay 2 times more for DDR5..or not
description: being thrown a bunch of ddr5 vs ddr4 facts is easy but I dont really
  get it.
publishDate: 5 Sep 2026
tags:
- today i learned
pinned: false
draft: false
---

Today I dug into another rabbit hole with one google search "why is ddr5 faster than ddr4?", then I realised that I didn't really get it so one search led to another and finally this blog post I quickly churned! Here I tie all the context of Random Access Memory (RAM) to understand in full detail why u pay more for DDR5 over DDR4. 

## What is DDR?

DDR (Double Data Rate) and it is an architecture that defines a memory design where data transfer happens twice on a single clock cycle, both on a rising and falling edge.


:::figure
![Desktop View](./fbfa0ac35691.png)

The different reads on a clock cycle [source](https://en.wikipedia.org/wiki/Double_data_rate)
:::


With faster transfers going at 2 per cycle, data flows much faster per clock, which leads to faster data transfer rates that are defined in hertz (MHz) or Mega Transfers (MT/s). So a *DDR5-6400* has a 6400MT/s rate.  But simply put, DDRx signifies the generations that using this architecture to increase data transfer rates, expand capacities and lower energy consumption [^1] 

:::tip
Hertz : The unit of cycles per second.
:::

## The elephant in the room

So what makes the generations different between 4 and 5? The main reasons can be summarised into 3 main categories: Speed range, module data width + burst length and operating voltage.


:::figure
![Desktop View](./b93215dd5e85.png)

[^2]
:::


### Why can transfer speeds go up for the same architecture?

Although 2 transfers can happen on each clock's rise and fall, we can shorten the period of each clock by increasing the frequency but this causes problems with ensuring each bit is read correctly. The whitepaper by Micron[^2] describes the main optimization was to be a higher I/O switching rate and mentions the features added to make it happen with the main one to be..

> the addition of equalization in the form of a multi-tap decision feedback equalizer (DFE) in the DQ receivers. 

.. Not gonna lie, they almost lost me here. When I googled about DFE I was thrown a bunch of equations that I do not understand. The gist was that signals are high frequencies get distorted (like it becomes funky) and the main problem is Inter-symbol Interference (ISI) where signals bleed into one another that compromises on data integrity.


:::figure
![Desktop View](./dfedb4214e92.png)

"A primary bottle neck in high-speed communication" [^3]
:::


DFE then fixes this problem with some magic which is just using previous bits to predict or cancel the interference to the current bit. *Ah! this reminds me to do my signals tutorial which I'm procrastinating on.*  With these optimizations that ensures high frequencies still lead to reliable data, DDR4 data rates spanning 1600-3200MT/s can now span 3200-6400MT/s on the DDR5, which means greater bandwidths!

:::tip
Bandwidth : Maximum amount of data that can be transferred over a network connection in a given amount of time
:::

### Better power management!

To make data transfer speeds increase, power management is also crucial and DDR5 introduces a local voltage regulation on the module through the Power Integrated Management Circuit (PMIC). Historically, power management of memory has always been performed on the motherboard and with the tighter margins on DDR5, voltage needs to be consistent for transistors and timings to be reliable. 


:::figure
![Desktop View](./72978d780b59.png)

[^4]
:::


Introducing PMIC enables better power regulation since it is directly on memory, providing a smart voltage regulation system for the DDR5.[^4]

### More channels!

Not only that, another optimisation is a new protocol feature added to DDR5 that increases burst length from 8 -> 16 and adds subchannels.

Initially, DDR4 has a burst length of BL8 which means one read/write can transfer 8 * 64 = 512 bits = 64 bytes of data. With a burst length of 16 (BL16) and subchannels added, we can now transmit 16 * 32 =  64 bytes of data using only one channel, which is half of the DDR5 DIMM[^2]. With a new subchannel adds additional concurrency to memory, allowing more than one request at the same time. *Parallelism!*

## But! Latency hasn't really improved.

Although the bandwidth has increased on the DDR5, the latency for a single address is still not any better than the DDR4 for a multitude of reasons. 


:::figure
![ddr5 latency slide](./b534e075b80a.png)

In a 2021 talk by Brendan Gregg [source](https://www.slideshare.net/slideshow/computing-performance-on-the-horizon-2021/249606880)
:::


One is that electricity can only be so fast on a silicon level, with transfer speeds being higher, the physical time it takes to charge a capacitor, read data is limited by the speed of electricity on silicon which wont change unless the RAM is physically closer to the motherboard. 

CAS (Column Access Strobe) Latency aka CL refers to how much time your RAM takes to start delivering the data the CPU asks for. A CL30 would take 30 clock cycles which is the unit of time the CPU and RAM takes to coordinate the task from when it is requested[^5].

$$
\begin{equation}
\text{Latency (ns)} = CL \times \frac{2000}{\text{Ram speed in MT/s}}
\label{eq:cas-latency}
\end{equation}
$$

So the latency consists of memory speed and CL, and a good performance requires a balance of both since CL is measured in clock cycles...

> you also need to consider the RAM’s clock speed or data rate. This is because faster RAM completes each clock cycle more quickly. As a result, a higher CAS latency value on faster RAM can still produce a lower actual delay when compared to slower RAM with a lower CL number. 

Higher speed memory usually refers to a higher CL which is defined by the manufacturer. Since clock cycles are shorter now, but the same time is used to access the same resource, CL values will increase to reflect the same amount of time. 

So balancing both depends on what you're doing. Transfer speed could matter more to workloads with continuous memory access in big chunks, while latency would matter more to unpredictable memory access. But the idea here is that the numbers on your RAM basically doesn't matter that much. 


:::figure
![alt text](./998f05d5ec8d.png)

Price and latency comparison of the Corsair Vengeance
:::


Yet there is a like a USD$100+ difference. 


## Mmmmm...

These features added allow us to shave of more milliseconds of our computers so I can see myself get shot faster when I turn a corner on Dust II and then watch my playback with some stranger dissing me on VC... *oh the amazing wonders of technology!* 

I didn't get too deep here but I think all these googling has satisfied my curiosity more than a couple of bullet points on why I should drop more money on DDR5....but maybe not in this economy. 


:::figure
![Desktop View](./f2c992e47424.png)

I love RAM prices
:::


[^1]: https://www.kingston.com/en/blog/pc-performance/ddr-memory-generation-differences
[^2]: https://assets.micron.com/adobe/assets/urn:aaid:aem:f1706cdb-4b55-4568-84bc-b7ee42f46236/original/as/ddr5-more-than-a-generational-update-wp.pdf 
[^3]: https://resources.l-p.com/glossary/intersymbol-interference-isi-in-digital-communication-explained
[^4]: https://assets.micron.com/adobe/assets/urn:aaid:aem:5902f17e-8bde-4246-971c-8d7f274c6b1a/original/as/ddr5-key-module-features-wp-client.pdf
[^5]: https://www.kingston.com/en/blog/gaming/cas-latency-cl-ram-timing-explained
