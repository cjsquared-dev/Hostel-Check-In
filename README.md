# [Hostel Check-in](https://hostel-check-in.vercel.app/)

## Walkthrough video
video walkthrough: https://drive.google.com/file/d/1yJ1B2DEhv8R5dskspjL5q7Qee4fnK7m7/view?usp=sharing

### Deployed site: https://hostel-check-in.vercel.app/



## Description
Hostel Check-In System is a Next.js + TypeScript application designed to help hostel managers efficiently track check-ins, check-outs, and tenant transactions. The system enables secure user authentication, records tenant details, manages payments, and monitors room availability in real-time. With a polished, interactive UI and a backend powered by Node.js, Express, and MongoDB, this project streamlines hostel operations while ensuring data security through JWT authentication. The application is designed for easy deployment using Vercel and Render for seamless cloud hosting.

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Usage
### User Story
AS A HOSTEL MANAGER, I want to:
- Record and track the check-in and check-out process of each tenant as a unique transaction.

WHEN A tenant checks in, I want to:
- Collect the following information as part of a unique transaction:
  - First Name
  - Last Name
  - Room Number
  - Deposit Amount
  - Payment Amount
  - Check-in Date
- Automatically calculate their check-out or renewal date based on their payment.

WHEN I log in each day, I want to:
- See a weekly view of tenants who are required to check out or renew within the next 7 days.

- WHEN I renew a tenant and accept payment, I want to:
Update their existing check-in transaction to reflect the additional payment for the room.

WHEN A tenant checks out, I want to:
- Record the room they are vacating.
- Mark the transaction as complete.
- Display the returned deposit amount.

## Installation
This application is deployed on [Vercel](https://hostel-check-in.vercel.app/).

## Demonstration
<div style="margin-left: 40px;">
  Demonstration of the application's desktop interface:<br/>
  <img src="./src/assets/README-Desktop.gif" alt="Desktop demonstration video" width="550"/>
</div>
<br/>

<div style="margin-left: 40px;">
  Demonstration of the application's mobile interface:<br/>
  <img src="./src/assets/README-Mobile.gif" alt="Mobile demonstration video" width="175"/>
</div>
<br/>

## Technologies Employed
Main Technologies:
- Next.js (React framework for building full-stack apps)
- React (UI library for component-based development)
- TypeScript (Adds type safety to JavaScript)
- Mongoose (MongoDB ORM for database handling)

Styling & UI:
- Tailwind CSS (Utility-based styling)
- Radix UI + ShadCN/UI (Accessible, pre-built components)
- Lucide & Heroicons (Icon sets for UI)

Forms & Validation:
- React Hook Form (Form handling)
- Zod (Schema validation)

Authentication & Security:
- NextAuth.js (User authentication)
- Bcrypt (Password hashing)

Other Utilities:
- ESLint (Code linting)
- Dotenv (Environment variables)
- UUID (Unique ID generation)

## Future Development

Front End:
  - Improve UI responsiveness and accessibility
  - Add dark mode support
  - Enhance tenant dashboard for better usability

Back End
- Optimize database queries for better performance
- Implement caching strategies for frequently accessed data
- Strengthen authentication and authorization measures

Admin
- Develop advanced analytics and reporting tools
- Add role-based access controls for different user levels
- Improve logging and monitoring for system activities

Tenant
- Allow tenants to submit maintenance requests online
- Implement a chat system for tenant-landlord communication
- Enable profile management with document uploads

Payment
- Integrate additional payment gateways
- Automate invoicing and receipt generation
- Implement payment reminders and late fee calculations

## Contributing
Contributions are welcome and encouraged. To do so:
- Fork this repository. 
- Your pull request will need approval in order to merge to ```main```.
- Take a look at the [Future Development](#future-development) section to see what I am currently working on.

## Credits
Tyanne:   
[GitHub](https://github.com/tyannejensen)

Luke:   
[GitHub](https://github.com/flynno-io)

Skylar:   
[GitHub](https://github.com/skylark-shae)

Chris:  
[GitHub](https://github.com/cjsquared-dev)

## Tests

Test Credentials:

Username/email:  john@test.com
Password: password123



## Questions
Fill

## License

This project is licensed under the MIT license.

The MIT License is a permissive software license originating at the Massachusetts Institute of Technology (MIT)[6] in the late 1980s.[7] As a permissive license, it puts very few restrictions on reuse and therefore has high license compatibility.

For more information visit [MIT Licensing](https://choosealicense.com/licenses/mit/).

- - -



# NEXT.JS
## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
