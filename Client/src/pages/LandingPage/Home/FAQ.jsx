import React from "react";

const FAQ = () => {
  return (
    <section className="dark:bg-[#ffffff] md:w-[90vw] rounded-lg mb-10 lg:w-[80vw] mx-auto dark:text-black">
      <div className="container flex flex-col justify-center p-4 mx-auto md:p-8">
        <p className="p-2 text-sm font-medium tracking-wider text-center uppercase">
          How it works
        </p>
        <h2 className="mb-12 text-4xl font-bold leading-none text-center sm:text-5xl">
          Frequently Asked Questions
        </h2>
        <div className="flex flex-col divide-y sm:px-8 lg:px-12 xl:px-32 dark:divide-gray-700">
          <details>
            <summary className="py-2 outline-none cursor-pointer focus:underline">
              What is a no-code website builder?
            </summary>
            <div className="px-4 pb-4">
              <p>
                A no-code website builder allows you to create websites without writing any code. Using intuitive drag-and-drop tools, you can design and customize websites with ease.
              </p>
            </div>
          </details>
          <details>
            <summary className="py-2 outline-none cursor-pointer focus:underline">
              Do I need any coding skills to use this platform?
            </summary>
            <div className="px-4 pb-4">
              <p>
                No! Our platform is designed for users of all skill levels. You can create beautiful, functional websites without any coding knowledge.
              </p>
            </div>
          </details>
          <details>
            <summary className="py-2 outline-none cursor-pointer focus:underline">
              What features does your website builder offer?
            </summary>
            <div className="px-4 pb-4 space-y-2">
              <p>
                Our platform includes real-time collaboration, version control, live hosting, AI-powered content generation, customizable templates, and much more.
              </p>
            </div>
          </details>
          <details>
            <summary className="py-2 outline-none cursor-pointer focus:underline">
              Can I collaborate with my team in real time?
            </summary>
            <div className="px-4 pb-4 space-y-2">
              <p>
                Yes! Our real-time collaboration feature allows you to work with your team simultaneously, making it easy to share feedback and make updates on the go.
              </p>
            </div>
          </details>
          <details>
            <summary className="py-2 outline-none cursor-pointer focus:underline">
              How do I ensure my website is secure on your platform?
            </summary>
            <div className="px-4 pb-4 space-y-2">
              <p>
                We use top-tier security practices, including SSL encryption, secure hosting, and regular platform updates to ensure your website and data are protected.
              </p>
            </div>
          </details>
          <details>
            <summary className="py-2 outline-none cursor-pointer focus:underline">
              Can I integrate third-party tools or services into my website?
            </summary>
            <div className="px-4 pb-4 space-y-2">
              <p>
                Yes! Our platform supports third-party integrations, allowing you to easily add tools like payment gateways, analytics, and more.
              </p>
            </div>
          </details>
          <details>
            <summary className="py-2 outline-none cursor-pointer focus:underline">
              How can I get started with your platform?
            </summary>
            <div className="px-4 pb-4 space-y-2">
              <p>
                Simply sign up for a free account, choose a template, and start customizing your site using our drag-and-drop editor. No coding experience required!
              </p>
            </div>
          </details>
          <details>
            <summary className="py-2 outline-none cursor-pointer focus:underline">
              Can I publish my website right away?
            </summary>
            <div className="px-4 pb-4 space-y-2">
              <p>
                Yes! Once you're happy with your website, you can publish it instantly with just a click. Your site will be hosted live with our secure hosting.
              </p>
            </div>
          </details>
          <details>
            <summary className="py-2 outline-none cursor-pointer focus:underline">
              How can I track the changes I make to my website?
            </summary>
            <div className="px-4 pb-4 space-y-2">
              <p>
                Our platform offers version control, so you can track all changes made to your website and revert to any previous versions if needed.
              </p>
            </div>
          </details>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
