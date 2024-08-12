# Backend Services and Queue Management

## Overview

This backend system is designed to provide a robust and scalable infrastructure for handling a variety of services, including chart analysis, trade journal management, usage tracking, and job queue management. The backend is implemented using a combination of MongoDB for database operations, BullMQ for job queue management, and Stripe for subscription and usage tracking. The system is designed to handle high concurrency with reliability and is easily extensible for future services.

## Key Features

### 1. **Chart Analysis Services**
   - **Analysis Execution**: 
     - The system can analyze charts by generating text-based outputs from chart images.
     - It supports both single and multi-chart analysis.
     - Validates incoming requests using `AnalysisJobSchema`.
     - Leverages AI prompts (`chartAnalysisPrompt` and `chartAnalysisMultiPrompt`) to generate the text analysis.
     - Results are stored in MongoDB, and charts are uploaded to Cloudinary.
   - **Analysis Storage and Retrieval**: 
     - Analyses can be saved and retrieved from the MongoDB `ChartAnalysis` collection.
     - Charts are stored on Cloudinary for easy access and reference.

### 2. **Trade Journal Services**
   - **Journal Entry Management**:
     - Provides functionality to add trade journal entries.
     - Journal entries are stored in the MongoDB `TradeJournal` collection.
   - **Entry Retrieval**:
     - Supports pagination for retrieving user-specific journal entries.

### 3. **Usage Tracking Services**
   - **Usage Monitoring**:
     - Tracks service usage per user on a daily, monthly, and total basis.
     - Limits are enforced based on the user's subscription plan (managed via Stripe).
   - **Subscription Plan Handling**:
     - Determines the maximum monthly usage based on the user's subscription plan cost and status.
     - Free users and different subscription tiers have distinct usage limits.

### 4. **Queue Management**
   - **Job Queue Handling**:
     - Manages background jobs using BullMQ, with support for delayed, recurring, and immediate jobs.
     - Automatically removes completed jobs and can handle job cancellation.
   - **Job Recurrence**:
     - Supports adding recurring jobs with cron-like patterns.
     - Ensures that no duplicate recurring jobs are added.
   - **Job Monitoring and Cancellation**:
     - Provides methods to find jobs by name, monitor job status, and cancel pending jobs.
   - **Background Job Cleanup**:
     - Implements a mechanism for scheduling the removal of expired jobs.
     - Ensures no pending background jobs exist once the main job is completed.

### 5. **Worker Management**
   - **Task Execution**:
     - Workers execute tasks defined by `ServiceJob`.
     - Each worker is linked to a specific queue and can be configured for concurrency and rate-limiting.
   - **Event Handling**:
     - Workers can trigger event handlers for job completion, failure, and progress.
   - **Worker Lifecycle Management**:
     - Supports starting and stopping of workers, ensuring clean job processing.

## Technologies Used
- **MongoDB**: Used for storing analysis results, journal entries, and usage data.
- **BullMQ**: Handles job queues, enabling delayed, recurring, and scheduled job execution.
- **Cloudinary**: Manages storage for chart images.
- **Stripe**: Manages user subscriptions and determines usage limits.
- **TypeScript**: The backend is written in TypeScript, providing type safety and better developer experience.
- **OpenAI GPT4o**: GPT 4o's vision capabilities are used to provide the analysis

## Conclusion

This backend system is a comprehensive solution for managing services that require heavy processing, background task management, and robust storage capabilities. The combination of MongoDB, BullMQ, and Stripe allows for a scalable, reliable, and efficient system that can be easily extended to support additional services and features.