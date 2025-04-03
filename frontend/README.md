This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

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

## Chat gpt plan:

Below is a suggested step-by-step plan outlining the tasks and their order to complete the project:

### Authentication Implementation (In progress)

- Create a dedicated login page/component that uses the web service API for user authentication. (komið)

- Add a form for entering credentials, handling login requests, and displaying error or success messages. (komið)

- Update the global layout (e.g., Header) to conditionally display login, logout, or user-specific options based on the authentication state. (Komið en vantar stílingu)

### Additional Pages & Routing

- Develop at least three distinct pages beyond the front page and product list. For example:

1. A detailed product view page that shows a single product’s details. (Komið en vantar stílingu, REVIEW STOREAST EKKI)

2. An order history page to view your orders (komið)

3. An entry page to post new products

4. A way to order (Komið)

5. Admin page to create/edit/delete products (Byrjað, vantar leið til að setja inn myndir)

### Image Upload Functionality

- Build a form that allows users to upload images.

- Integrate the form with the image API from your web service, including error handling and feedback for the user.

### Error Handling and UI States

- Implement loading states (e.g., spinners or placeholders) when data is being fetched.

- Ensure error messages are shown when API calls fail.

- Create and display empty states for pages when there is no data to show.

- UI Enhancements and Active Navigation

- Enhance the header navigation to visually indicate which page is active.

- Consider adding persistent elements (e.g., search bar, cart) if required by the assignment.

### Global Tooling and Quality Improvements

- Set up ESLint (and optionally Prettier) to enforce coding standards, and ensure npm run lint produces no errors.

- Add tests if required, or at least ensure manual testing for all functionalities.

### Documentation and Deployment

- Update the README.md with detailed setup instructions, admin credentials, and team member information.

- Deploy the project to your chosen hosting service and update the README with the live URL.

### Version Control and Collaboration

- Make sure to use Git effectively with frequent commits.

- Create at least five pull requests with team reviews to demonstrate proper collaboration.
