# ChartWise

## What is ChartWise?

ChartWise is a tool designed to analyze charts, providing an overview, a trade execution plan, and a summary. It helps traders identify patterns, trends, and other essential insights for precise trade execution strategies. Users simply take a screenshot of the chart they want to analyze and upload it to ChartWise. Additionally, users can provide information such as their strategy, criteria, and risk tolerance to tailor and optimize the analysis.

## Why I Made It

The main reason for creating ChartWise was to address a personal challenge in trading. I often struggled with the lack of a proper trade execution strategy and consistently following one. While I was often correct in my general trade bias, I frequently lost trades due to poor execution. ChartWise was developed to mitigate this problem by providing practical trade execution insights.

## How I Made It

### Frontend

**Tech Stack**:
- Next.js
- TypeScript

The frontend of ChartWise is built using Next.js and TypeScript. Next.js is a framework for building server-side rendered React applications, which ensures fast performance and SEO optimization. TypeScript adds static typing to JavaScript, improving code quality and maintainability.

### Backend

**Tech Stack**:
- TypeScript
- Express.js
- MongoDB
- BullMQ

The backend API is constructed using TypeScript and Express.js, a flexible Node.js web application framework. MongoDB is used as the database due to its scalability and flexibility in handling large data volumes. BullMQ, a library for handling jobs and messages in Node.js, is employed for queue management.

The use of queues in ChartWise is essential for efficiently handling multiple chart analysis requests, ensuring each request is processed timely and orderly. A custom implementation of BullMQ is used to manage job priorities and execution, optimizing the service's performance and reliability.

The frontend communicates with the backend through polling, a technique where the frontend repeatedly checks the backend at regular intervals for updates. This ensures users receive real-time updates on their chart analysis, improving the overall user experience.

## Conclusion

ChartWise was created to address a significant pain point in my trading journey: the lack of a proper trade execution strategy. By providing detailed insights and practical trade execution plans, ChartWise helps traders make more informed decisions and improve their overall trading performance.

With a user-friendly interface and robust backend, ChartWise is designed to be an indispensable tool for traders of all levels. Whether you're a beginner looking to understand charts better or an experienced trader aiming to refine your strategies, ChartWise offers the insights you need to succeed.

Try ChartWise today and take the first step towards more precise and informed trading decisions.