## Perceptron-Labs Assignment

# Full-stack project
Create a forum where users can submit ideas for future simulations that our company might run. The forum should allow users to submit their name and a comment, which will then be published to an ongoing thread. Visitors to the site should be able to upvote these ideas Reddit-style, indicating their support for each idea. The forum must display ideas sorted by the number of upvotes, with the most upvoted ideas at the top. In case of a tie, ideas should be sorted by the time that they were published, with the most recent ones appearing first. The design should closely follow the style of our existing [website](http://perceptron.so) (you can also refer to our [blog](http://perceptron.so/blog) for design cues).

The data should be persistent (don’t store posts in browser state – think SQLite or even a .txt file!)

## Tech Stack Used

1. Next.JS
2. Redis
3. SQLite
4. Prisma
5. Tailwind CSS


## How to setup ?

# First: Redis setup

- Install redis locally or use docker to run redis on default port 6379

# Second: Setup project locally

- clone the github repo
- npm i 
- npx prisma migrate dev --name init

## Start the project

# Before proceeding to the next step, make sure the redis server is running and db is connected

- docker ps (To check the active containers if you are using docker to run redis)
- npx prisma studio (To run SQLite DB on server)

# The project is capable to handling servers running parallely locally

To observe the behaviour, the application need to run in multiple ports parallely where each port is a different user.

All the actions done by a user are replicated in other user interface upon reloading the screen

# Run the below commands separately in different terminals
bash
```
npm run dev
set PORT=4000 && npm run dev
set PORT=5000 && npm run dev

```