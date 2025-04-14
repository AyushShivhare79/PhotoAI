# PhotoAI

PhotoAI is a modern web application that leverages AI technology to generate images based on text prompts. Built with Next.js and integrated with OpenAI's image generation capabilities, PhotoAI provides an intuitive interface for creating AI-generated artwork.

## Features

- **AI Image Generation**: Transform text prompts into high-quality images using advanced AI models
- **User Authentication**: Secure login system powered by NextAuth.js
- **Image History**: View and manage your previously generated images
- **Cloud Storage**: All generated images are stored securely using ImageKit
- **Responsive Design**: Seamless experience across desktop and mobile devices

## Tech Stack

### Frontend
- [Next.js 15](https://nextjs.org/) - React framework with server-side rendering
- [React 19](https://react.dev/) - UI library
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [React Hook Form](https://react-hook-form.com/) - Form validation

### Backend
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction) - Serverless functions
- [Prisma](https://www.prisma.io/) - ORM for database operations
- [NextAuth.js](https://next-auth.js.org/) - Authentication
- [OpenAI API](https://openai.com/api/) - AI image generation
- [ImageKit](https://imagekit.io/) - Image storage and delivery

## Getting Started

### Prerequisites
- Node.js (v18 or later recommended)
- pnpm
- Database (compatible with Prisma)

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/PhotoAI.git
cd PhotoAI
```

2. Install dependencies
```bash
pnpm install
```

3. Set up environment variables
```bash
# Copy the example environment variables file
cp .env.example .env

# Then edit .env with your actual configuration values
```

4. Initialize the database
```bash
pnpm prisma db push
```

5. Start the development server
```bash
pnpm dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. Sign in to your account
2. Navigate to the Create page
3. Enter a detailed text prompt describing the image you want to generate
4. Click "Generate" and wait for the AI to create your image
5. View, download, or share your generated images

## Project Structure

```
app/                 # Next.js application routes
  api/               # API routes for authentication, generation, etc.
  create/            # Image creation page
components/          # Reusable UI components
lib/                 # Utility functions and configuration
prisma/              # Database schema and client
public/              # Static assets
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- OpenAI for providing the image generation technology
- Next.js team for the amazing framework
- ImageKit for image storage solutions
````