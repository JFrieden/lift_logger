# Lift Logger

A PERN stack mobile-first web app for tracking weight lifting workouts. Find the current prod deployment [here](https://lift-logger-4b08aa94a99a.herokuapp.com).

## Introduction

Most lifting apps I've used in the past have gone too far in one of three directions:
1. **Lifting as Social Media Platform:** replete with social networks, automated "posts" of your workouts, likes, comments, feeds, the full 9 yards. In my experience, people who want to post about their workouts are more likely to do so on dedicated social platforms, like Instagram, X, and Snapchat. These platforms offer invariably superior UI/UX, allow users to curate a far larger audience of lifters and non-lifters who will interact with their posts, and **doesn't cost them and their audience a monthly subscription to use.** 
2. **Coaching Apps:** Truth is, this is my least problematic of the three types of lifting app. That said, I've found that they can fall into a trap of being overbearing. The ability to create my own routines, workout on my own schedule, and do the specific exercises I want to is worth more to me at this stage in my lifting career than the sometimes overbearing tips, programs, notifications, etc. that can come in these apps.
3. **Gameified Lifting:** At the risk of sounding irritable, I can't stand these. I don't want a cute mascot giving me points, or streaks, or anything else while I'm grasping onto consciouness after completing my third set of bulgarian split squats at an 8 or 9 RPE.

And of course, to get any meaningful use out of any of these apps requires paying a monthly subscription.


Hence, Lift Logger. If I'm going to pay for it, I'm going to make it into exactly what I want: A simple WebApp with a clean logging format, strong convenience features for the logging experience, and some basic analytics. No posts, no limited program selection, no points.

## Using Lift Logger:

Demo material forthcoming

## Tech Stack:

A key motivator for this project is that I've wanted to do a full(ish) stack project with a pinch of analytics and dashboarding mixed in for quite awhile. Since this is my first major solo project of that sort, I kept it simple and chose a stack with super strong community support. Postgres (a la supabase), Express, React, and Node. Besides maybe a MERN stack, it doesn't get much more commonplace than this. 

Discerning readers may notice that I mentioned both a Supabase DB and an Express backend server. Sure, they're not mutually exclusive, but why both?
* Supabase offers some built in backend features, and handles things like authentication directly. You could easily build a simple webapp such as Lift Logger with just Supabase for a backend/DB combo.

BUT
* Keeping the E in my PERN seems like more fun, and I can mix and match client-supabase vs. client-backend-supabase interactions for different scenarios. Even if it likely won't be in necessary in the context of this project to have a complex layering, it seemed like a fun exercise.

The Supabase + Express choice is indicative of a larger goal: I plan to architect and engineer this as thoroughly as my knowledge and wallet will allow.

## Contributing:

This repository enforces a forking workflow.
1. Fork this Repository.
2. Clone your fork `git clone https://github.com/{your_username}/{your-fork}.git`
3. Create a new branch: `git checkout -b feature-name`.
    *  See _Setting up your local environment_ for a quickstart on getting set up to develop your feature
4. Make your changes and commit them.
5. Push to your fork: `git push origin feature-name`.
6. Open a pull request to the main repository.

**Setting up your local environment:** once you've forked, cloned, and branched your way into a local development space
1. Download the necessary modules by navigating your terminal to the project root and running `npm install`
2. Repeat step 1 inside the `front-end/` and `back-end/` directories.
3. Add a `.env` file to the root of your project containing the variables `SUPABASE_URL` and `SUPABASE_KEY` if you intend to run your own DB or backend.
    *  Material for creating your own Supabase Clone forthcoming
4. Update `front-end/src/axios_instance.js` to point to the url of your backend server.

I don't expect any external contributors, but they're certainly welcome, and I'll do my best to be responsive to anyone interested :).

## API Documentation:

Documentation forthcoming

## Testing Suite:

Documentation forthcoming
