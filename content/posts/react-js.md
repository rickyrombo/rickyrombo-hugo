+++
date = "2016-11-11T05:19:18-06:00"
draft = true
title = "site rebuilt from the ground up"
description = "react js is pretty neat..."
+++

As I was starting [my new series](#/series/intro-to-edm), I noticed a few things on my website weren't working. I also noticed that my SoundCloud API was old which was likely part of the problem. In the process of fixing things, I decided this would be a good opportunity for me to learn ReactJS and just rebuild my website as a React website.

So I did, and it took me a good chunk of a week.

I have rebuilt the entire site frontend to operate by using ReactJS. I also added a proper Node backend so I can use things like Webpack and Babel and write my JavaScript in ES2015 and use JSX. I ran into a few problems while doing this.

Most notably, I still use a static website generator, [Hugo](http://gohugo.io), which makes less sense with ReactJS. I might move away from it in the future and roll my own site generator (or use an existing React one) that works better with React.

Second, I had to do a couple of hacks to get a few components to talk to each other, and get things that weren't components to talk to components (like sounds linked in posts made in Hugo). It makes more sense for the player to handle all of its own state, rather than bubbling that up to the root React element - even if it meant I now had to communicate with the player through global events to get sounds from the post you clicked on to load in the player. I might go back and fix it to make it more friendly if I ever move away from Hugo, as then I could just have components for every sound instead of having to bind to rendered sounds embedded in posts.

Third, I had difficulty using react-router. I realized it was slightly overkill and wasn't really necessary, and that I have a much better understanding and control of what's going on with rolling my own navigation. It's just hashchange events, anyway.

All in all it was a good learning experience. I think I've really started to learn how to think in React. There's still a lot to do (and new bugs got introduced in the switch), but overall things are looking pretty decent.