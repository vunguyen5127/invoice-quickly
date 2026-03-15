import React from "react";
import { InvoiceState } from "@/types/invoice";

export interface SEOPageContent {
  slug: string;
  metadata: {
    title: string;
    description: string;
  };
  hero: {
    badge: string;
    title: string;
    highlight: string;
    description: string;
  };
  overview: {
    title: string;
    content: string;
  };
  features: {
    title: string;
    items: {
      title: string;
      description: string;
      icon: "zap" | "shield" | "fileText" | "globe" | "users" | "creditCard";
      color: string;
    }[];
  };
  exampleInvoice: {
    title: string;
    description: string;
    data: Partial<InvoiceState>;
  };
  faq: {
    title: string;
    items: {
      question: string;
      answer: string;
    }[];
  };
}

export const marketingPages: SEOPageContent[] = [
  {
    slug: "invoice-template",
    metadata: {
      title: "Professional Invoice Templates — Create & Download Free PDF Invoices",
      description: "Get free professional invoice templates for your business. Customize, generate, and download PDF invoices online in seconds. No signup required.",
    },
    hero: {
      badge: "Free Invoice Templates",
      title: "Professional Invoice Templates for ",
      highlight: "Every Business",
      description: "Create stunning, professional invoices in seconds with our customizable templates. Perfect for freelancers and small businesses.",
    },
    overview: {
      title: "What makes a great invoice template?",
      content: "A great invoice template isn't just about looks—it's about clarity and professionalism. It needs to include your brand identity, clear contact information, an itemized list of services, and unambiguous payment terms. Our templates are designed to be clean, high-contrast, and easy for your clients to process, which helps you get paid faster.",
    },
    features: {
      title: "Why use our templates?",
      items: [
        {
          title: "Fully Customizable",
          description: "Adjust logos, colors, and fields to match your brand identity perfectly.",
          icon: "zap",
          color: "text-amber-500 bg-amber-50 dark:bg-amber-900/20",
        },
        {
          title: "Professional PDF Export",
          description: "Generate high-quality, print-ready PDF invoices with a single click.",
          icon: "fileText",
          color: "text-blue-600 bg-blue-50 dark:bg-blue-900/20",
        },
        {
          title: "Tax & Discounts",
          description: "Easily handle complex calculations for taxes, shipping, and discounts.",
          icon: "creditCard",
          color: "text-cyan-600 bg-cyan-50 dark:bg-cyan-900/20",
        },
      ],
    },
    exampleInvoice: {
      title: "Sample Professional Invoice",
      description: "See how a finished invoice looks. Notice the clear breakdown of totals and professional layout.",
      data: {
        company: { name: "Creative Design Studio\n123 Art Ave, San Francisco, CA 94103", logo: "", email: "hello@creative.studio", address: "123 Art Ave", phone: "+1 555-001" },
        client: { name: "TechStart Global\n456 Innovation Blvd, Suite 200, Austin, TX 78701", email: "billing@techstart.io", address: "456 Innovation Blvd", phone: "+1 555-002" },
        items: [
          { id: "1", description: "Brand Identity Design Package", quantity: 1, rate: 2500 },
          { id: "2", description: "UX/UI Design - Website Audit", quantity: 10, rate: 150 },
        ],
        details: { invoiceNumber: "INV-2026-001", issueDate: new Date().toISOString(), dueDate: new Date().toISOString() },
      },
    },
    faq: {
      title: "Frequently Asked Questions",
      items: [
        {
          question: "Can I save my templates for future use?",
          answer: "Yes! While you don't need an account to download an invoice, signing up for a free account allows you to save multiple company profiles and client details for even faster invoicing later.",
        },
        {
          question: "Do these templates work on mobile?",
          answer: "Absolutely. Our live editor and final PDF exports are fully responsive and designed to work perfectly on any device.",
        },
      ],
    },
  },
  {
    slug: "invoice-template-pdf",
    metadata: {
      title: "Free PDF Invoice Templates — Professional & Print-Ready",
      description: "Generate professional PDF invoices for free. High-quality layouts, instant download, and no watermark. The perfect PDF invoice generator for businesses.",
    },
    hero: {
      badge: "PDF Invoice Generator",
      title: "Create Professional ",
      highlight: "PDF Invoices",
      description: "Download beautiful, print-ready PDF invoices in seconds. No watermarks, no complex software, just professional results.",
    },
    overview: {
      title: "The Importance of PDF Invoices",
      content: "PDF is the industry standard for business documents because it preserves formatting across all devices. When you send a PDF invoice, you ensure your client sees exactly what you intended, regardless of whether they are on a phone, tablet, or desktop. Our system generates crisp, vectorized PDFs that look professional when printed or viewed digitally.",
    },
    features: {
      title: "PDF Best Practices",
      items: [
        {
          title: "Zero Watermarks",
          description: "Your brand takes center stage. We never add our logo to your exported documents.",
          icon: "shield",
          color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20",
        },
        {
          title: "Instant Download",
          description: "No waiting for emails. Your PDF is generated in the browser and ready to save immediately.",
          icon: "zap",
          color: "text-amber-500 bg-amber-50 dark:bg-amber-900/20",
        },
        {
          title: "Secure Sharing",
          description: "Beyond PDFs, generate secure links for clients to view and download their invoices online.",
          icon: "globe",
          color: "text-violet-600 bg-violet-50 dark:bg-violet-900/20",
        },
      ],
    },
    exampleInvoice: {
      title: "PDF Layout Breakdown",
      description: "Our PDF layout is optimized for A4 and Letter sizes, ensuring your invoice looks great on any printer.",
      data: {
        company: { name: "Pixel Perfect Agency\n789 Digital Way, London, UK", logo: "", email: "accounts@pixelperfect.co.uk", address: "789 Digital Way", phone: "+44 20 1234 5678" },
        client: { name: "Global Retailers Ltd\n321 Market St, Manchester, UK", email: "billing@globalretailers.com", address: "321 Market St", phone: "+44 161 987 6543" },
        items: [
          { id: "1", description: "Mobile App Development - Sprint 1", quantity: 1, rate: 5000 },
          { id: "2", description: "Production Cloud Hosting (Annual)", quantity: 1, rate: 1200 },
        ],
        details: { invoiceNumber: "INV-PP-102", issueDate: new Date().toISOString(), dueDate: new Date().toISOString() },
      },
    },
    faq: {
      title: "PDF Invoicing FAQ",
      items: [
        {
          question: "Can I edit a PDF after downloading?",
          answer: "PDFs are designed to be final documents. If you need to make changes, simply return to our editor, update the fields, and download a new version. It's much safer than trying to edit a static PDF.",
        },
      ],
    },
  },
  {
    slug: "invoice-template-excel",
    metadata: {
      title: "Free Online Invoice Template vs Excel — Which is Better?",
      description: "Discover why our free online invoice generator is more efficient than Excel templates. Create, automate, and download invoices without the spreadsheet headache.",
    },
    hero: {
      badge: "Upgrade from Excel",
      title: "Beyond the ",
      highlight: "Excel Spreadsheet",
      description: "Stop fighting with cells and formulas. Switch to a streamlined invoice generator that handles the math and formatting for you automatically.",
    },
    overview: {
      title: "Why switch from Excel to an Online Generator?",
      content: "While Excel is powerful, it wasn't built for invoicing. Formulas can break, formatting often shifts unexpectedly, and managing a history of files becomes a nightmare. Our generator provides the structure you need with the automation you want—automatic numbering, live preview, and consistent PDF exports without the manual labor.",
    },
    features: {
      title: "Smarter than Spreadsheets",
      items: [
        {
          title: "Automated Math",
          description: "Taxes, discounts, and totals are calculated instantly with 100% accuracy every time.",
          icon: "zap",
          color: "text-amber-500 bg-amber-50 dark:bg-amber-900/20",
        },
        {
          title: "Client Database",
          description: "Save client info for reuse. No more copy-pasting from one spreadsheet tab to another.",
          icon: "users",
          color: "text-pink-600 bg-pink-50 dark:bg-pink-900/20",
        },
        {
          title: "Version Control",
          description: "Every change is reflected in your dashboard. Access your invoice history from any device.",
          icon: "shield",
          color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20",
        },
      ],
    },
    exampleInvoice: {
      title: "Clean Design vs Clunky Cells",
      description: "Compare this professional layout to a typical grid-based spreadsheet. Which one would you rather receive?",
      data: {
        company: { name: "Logic & Data Consulting\n1 Commerce Cir, Chicago, IL 60611", logo: "", email: "info@logicdata.com", address: "1 Commerce Cir", phone: "312-555-0199" },
        client: { name: "Modern Dynamics\n500 Tech Plaza, Seattle, WA 98101", email: "finance@moderndynamics.com", address: "500 Tech Plaza", phone: "206-555-4422" },
        items: [
          { id: "1", description: "Business Intelligence Audit", quantity: 1, rate: 3500 },
          { id: "2", description: "Financial Modeling Services", quantity: 20, rate: 200 },
        ],
        details: { invoiceNumber: "INV-EXCEL-01", issueDate: new Date().toISOString(), dueDate: new Date().toISOString() },
      },
    },
    faq: {
      title: "Excel vs Online Generator FAQ",
      items: [
        {
          question: "Can I still export data for my accountant?",
          answer: "Yes! While we focus on beautiful PDF exports, our Pro dashboard allows you to manage and view your entire billing history, which is much easier to share with an accountant than a folder of Excel files.",
        },
      ],
    },
  },
  {
    slug: "free-invoice-template",
    metadata: {
      title: "Free Invoice Templates for Small Businesses | No Signup",
      description: "Access 100% free invoice templates. No hidden fees, no watermarks, and no sign-up required. Perfect for small businesses and freelancers.",
    },
    hero: {
      badge: "100% Free Forever",
      title: "Genuinely ",
      highlight: "Free Templates",
      description: "High-quality professional invoices without the price tag. Generate and download as many as you need, absolutely free.",
    },
    overview: {
      title: "Why we believe in Free",
      content: "As small business owners ourselves, we know that every dollar counts when you're starting out. That's why our core invoice generator is free. We don't believe in holding your business documents hostage or adding ugly watermarks to your hard work. You get professional features for free, supported by our optional advanced dashboard for growing teams.",
    },
    features: {
      title: "Free doesn't mean basic",
      items: [
        {
          title: "Unlimited Invoices",
          description: "There is no cap on how many invoices you can create or download per month.",
          icon: "fileText",
          color: "text-blue-600 bg-blue-50 dark:bg-blue-900/20",
        },
        {
          title: "Full Feature Access",
          description: "Get access to tax settings, discounts, shipping, and multiple line items for free.",
          icon: "zap",
          color: "text-amber-500 bg-amber-50 dark:bg-amber-900/20",
        },
        {
          title: "No Account Needed",
          description: "Start typing and download. We don't force you to sign up before you see your invoice.",
          icon: "users",
          color: "text-pink-600 bg-pink-50 dark:bg-pink-900/20",
        },
      ],
    },
    exampleInvoice: {
      title: "Unmatched Quality for Free",
      description: "Our free templates rival expensive paid software. Professional, clean, and client-ready.",
      data: {
        company: { name: "The Local Bakery\n15 Flour Lane, Portland, OR 97201", logo: "", email: "bakery@localpdx.com", address: "15 Flour Lane", phone: "503-555-1234" },
        client: { name: "Portland Cafe Group\n88 Espresso Ave, Portland, OR 97204", email: "orders@pdxcafe.com", address: "88 Espresso Ave", phone: "503-555-5678" },
        items: [
          { id: "1", description: "Artisan Bread Supply - Weekly", quantity: 5, rate: 450 },
          { id: "2", description: "Pastry Platter - Event Catering", quantity: 2, rate: 125 },
        ],
        details: { invoiceNumber: "INV-LB-005", issueDate: new Date().toISOString(), dueDate: new Date().toISOString() },
      },
    },
    faq: {
      title: "Free Invoicing FAQ",
      items: [
        {
          question: "How do you make money if it's free?",
          answer: "We offer a Pro version of our dashboard for users who want advanced features like automated recurring invoices, team management, and deeper analytics. The generator itself will always stay free.",
        },
      ],
    },
  },
  {
    slug: "blank-invoice-template",
    metadata: {
      title: "Blank Invoice Templates — Clean, Flexible & Ready to Fill",
      description: "Download blank invoice templates to fill in manually or use our online editor for automated calculations. Clean, professional layouts for any industry.",
    },
    hero: {
      badge: "Clean Slate",
      title: "Blank Invoice ",
      highlight: "Templates",
      description: "Start with a clean slate. Our blank templates are flexible enough to work for any industry, from consulting to construction.",
    },
    overview: {
      title: "Flexibility for any Work",
      content: "Sometimes you just need a simple, blank structure that doesn't get in your way. Our blank invoice templates provide the skeleton of a professional document, allowing you to define your own fields, notes, and terms. Whether you're billing for hourly service or physical goods, these templates adapt to your specific needs.",
    },
    features: {
      title: "Blank but Balanced",
      items: [
        {
          title: "Dynamic Fields",
          description: "Add as many or as few line items as you need. The layout adjusts automatically.",
          icon: "zap",
          color: "text-amber-500 bg-amber-50 dark:bg-amber-900/20",
        },
        {
          title: "Minimalist Design",
          description: "Clean typography and precise spacing ensure your information is the focus.",
          icon: "fileText",
          color: "text-blue-600 bg-blue-50 dark:bg-blue-900/20",
        },
        {
          title: "Notes & Terms",
          description: "Plenty of room for custom notes, payment instructions, or specialized terms.",
          icon: "creditCard",
          color: "text-cyan-600 bg-cyan-50 dark:bg-cyan-900/20",
        },
      ],
    },
    exampleInvoice: {
      title: "Minimal Blank Template Example",
      description: "A clean, uncluttered invoice that lets your work speak for itself.",
      data: {
        company: { name: "Independent Consulting\n101 Strategy Way, New York, NY 10001", logo: "", email: "consult@indie.biz", address: "101 Strategy Way", phone: "212-555-9000" },
        client: { name: "Venture Partners Inc\n222 Finance Blvd, Greenwich, CT 06830", email: "billing@venturepartners.com", address: "222 Finance Blvd", phone: "203-555-8811" },
        items: [
          { id: "1", description: "General Consulting Services", quantity: 1, rate: 1200 },
          { id: "2", description: "Administrative Support", quantity: 5, rate: 85 },
        ],
        details: { invoiceNumber: "INV-BLANK-01", issueDate: new Date().toISOString(), dueDate: new Date().toISOString() },
      },
    },
    faq: {
      title: "Blank Template FAQ",
      items: [
        {
          question: "Can I add my logo to the blank template?",
          answer: "Yes! Simply upload your logo in the editor and it will be perfectly positioned at the top of your 'blank' template, making it instantly yours.",
        },
      ],
    },
  },
  {
    slug: "freelancer-invoice-template",
    metadata: {
      title: "Freelancer Invoice Templates — Get Paid for Your Work",
      description: "Professional invoice templates designed specifically for freelancers. Bill for hours, projects, or retainers with ease. No signup required.",
    },
    hero: {
      badge: "Built for Freelancers",
      title: "The Ultimate ",
      highlight: "Freelance Invoice",
      description: "Spend less time on paperwork and more time on your craft. Professional templates that help freelancers get paid faster.",
    },
    overview: {
      title: "Invoicing for the Modern Freelancer",
      content: "As a freelancer, your invoice is often the last interaction a client has with you. It should reflect the same quality as the work you've just delivered. Our templates handle hourly rates, fixed-fee projects, and even recurring retainers beautifully. We include dedicated sections for project notes and payment terms so there's never any confusion.",
    },
    features: {
      title: "Freelancer Focus",
      items: [
        {
          title: "Hourly & Fixed Billing",
          description: "Toggle between billing for hours worked or flat-rate project milestones.",
          icon: "zap",
          color: "text-amber-500 bg-amber-50 dark:bg-amber-900/20",
        },
        {
          title: "Direct Share Links",
          description: "Email a link to your client. See when they've viewed the invoice with our dashboard.",
          icon: "globe",
          color: "text-violet-600 bg-violet-50 dark:bg-violet-900/20",
        },
        {
          title: "Payment Terms",
          description: "Standardize your 'Due on Receipt' or 'Net 30' terms to ensure timely payment.",
          icon: "shield",
          color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20",
        },
      ],
    },
    exampleInvoice: {
      title: "Sample Freelancer Invoice",
      description: "Notice how the hourly breakdown is clear and the contact info is professional.",
      data: {
        company: { name: "Alex Chen | Motion Designer\n44 Frame St, Los Angeles, CA 90028", logo: "", email: "hello@alexchen.tv", address: "44 Frame St", phone: "323-555-4567" },
        client: { name: "Blue Ridge Media\n555 Production Dr, Atlanta, GA 30318", email: "finance@blueridgemedia.com", address: "555 Production Dr", phone: "404-555-7890" },
        items: [
          { id: "1", description: "3D Animation - Promotional Video", quantity: 1, rate: 3200 },
          { id: "2", description: "Video Editing (Overtime)", quantity: 12, rate: 95 },
        ],
        details: { invoiceNumber: "INV-CH-202", issueDate: new Date().toISOString(), dueDate: new Date().toISOString() },
      },
    },
    faq: {
      title: "Freelancer Invoicing FAQ",
      items: [
        {
          question: "Should I include my personal address?",
          answer: "It depends on your local laws, but most business invoices require a physical or registered billing address. If you're a digital nomad, many use a virtual mailbox service for professional invoicing.",
        },
      ],
    },
  },
  {
    slug: "contractor-invoice-template",
    metadata: {
      title: "Contractor Invoice Templates — Professional Billing for Pro Trades",
      description: "Rugged and professional invoice templates for contractors and trade businesses. Itemize labor, materials, and expenses easily. No signup required.",
    },
    hero: {
      badge: "Contractor Grade",
      title: "Professional ",
      highlight: "Contractor Billing",
      description: "Ditch the paper carbon copies. Professional digital invoices for contractors that handle labor, materials, and project stages effortlessly.",
    },
    overview: {
      title: "Efficient Billing for Contractors",
      content: "In the contracting world, invoices need to be detailed enough for insurance and clear enough for customers. Our templates allow you to itemize labor costs separately from material expenses or equipment rentals. You can even include payment schedules and detailed project notes to document the work performed on-site.",
    },
    features: {
      title: "Built for the Trade",
      items: [
        {
          title: "Materials & Labor",
          description: "Easily separate your service hours from the physical supplies used on the job.",
          icon: "fileText",
          color: "text-blue-600 bg-blue-50 dark:bg-blue-900/20",
        },
        {
          title: "Project Progress",
          description: "Create progress invoices for larger projects that span multiple weeks or months.",
          icon: "zap",
          color: "text-amber-500 bg-amber-50 dark:bg-amber-900/20",
        },
        {
          title: "Multi-Company",
          description: "If you run multiple crews or businesses, manage them all from one account.",
          icon: "users",
          color: "text-pink-600 bg-pink-50 dark:bg-pink-900/20",
        },
      ],
    },
    exampleInvoice: {
      title: "Sample Contractor Layout",
      description: "Clear itemization for labor and materials, perfect for home services or construction.",
      data: {
        company: { name: "Elite Roofing & Exterior\n900 Builder Ave, Denver, CO 80202", logo: "", email: "jobs@eliteroofing.com", address: "900 Builder Ave", phone: "303-555-1122" },
        client: { name: "Smith Residence\n1212 Suburban Ct, Aurora, CO 80012", email: "jsmith@gmail.com", address: "1212 Suburban Ct", phone: "720-555-3344" },
        items: [
          { id: "1", description: "Asphalt Shingle Replacement (Labor)", quantity: 1, rate: 4500 },
          { id: "2", description: "Grade A Roofing Materials", quantity: 1, rate: 3200 },
          { id: "3", description: "Gutter Cleaning (Complimentary)", quantity: 1, rate: 0 },
        ],
        details: { invoiceNumber: "JOB-4589", issueDate: new Date().toISOString(), dueDate: new Date().toISOString() },
      },
    },
    faq: {
      title: "Contractor Invoicing FAQ",
      items: [
        {
          question: "Can I include my license number?",
          answer: "Yes! We recommend adding your contractor license number and insurance details to the 'Notes' or 'Terms' section to build trust and meet local regulations.",
        },
      ],
    },
  },
  {
    slug: "how-to-write-an-invoice",
    metadata: {
      title: "How to Write an Invoice — A Complete Guide for Beginners",
      description: "Learn how to write a professional invoice that gets paid. Essential fields, legal requirements, and best practices for small business owners.",
    },
    hero: {
      badge: "Step-by-Step Guide",
      title: "How to Write a ",
      highlight: "Professional Invoice",
      description: "Don't know where to start? This guide covers everything you need to know about creating your first invoice and getting paid on time.",
    },
    overview: {
      title: "The Anatomy of a Perfect Invoice",
      content: "An invoice is a legal request for payment, so it needs to be accurate. At a minimum, it must include your business name, the word 'Invoice', a unique identification number, the date, a description of the services, and the amount due. Beyond the basics, adding your logo, clear payment instructions, and a friendly 'Thank You' can go a long way in maintaining client relationships.",
    },
    features: {
      title: "Essential Checklist",
      items: [
        {
          title: "Contact Information",
          description: "Clearly state your name, email, and address, along with your client's details.",
          icon: "users",
          color: "text-pink-600 bg-pink-50 dark:bg-pink-900/20",
        },
        {
          title: "Itemized Breakdown",
          description: "List each service or item on a separate line with its own quantity and rate.",
          icon: "fileText",
          color: "text-blue-600 bg-blue-50 dark:bg-blue-900/20",
        },
        {
          title: "Clear Totals",
          description: "Show subtotal, taxes, shipping, and the final grand total in a large, clear font.",
          icon: "creditCard",
          color: "text-cyan-600 bg-cyan-50 dark:bg-cyan-900/20",
        },
      ],
    },
    exampleInvoice: {
      title: "A Correctly Formatted Invoice",
      description: "Follow this example to ensure you haven't missed any critical business information.",
      data: {
        company: { name: "Pro Writing Services\n50 Wordsmith Rd, Seattle, WA 98115", logo: "", email: "write@prowriters.com", address: "50 Wordsmith Rd", phone: "206-555-6677" },
        client: { name: "Content Marketing Corp\n77 Media Lane, Los Angeles, CA 90001", email: "billing@contentcorp.com", address: "77 Media Lane", phone: "213-555-8899" },
        items: [
          { id: "1", description: "Technical Case Study - 2000 words", quantity: 1, rate: 800 },
          { id: "2", description: "SEO Optimization & Keyword Research", quantity: 4, rate: 125 },
        ],
        details: { invoiceNumber: "INV-PW-001", issueDate: new Date().toISOString(), dueDate: new Date().toISOString() },
      },
    },
    faq: {
      title: "Invoicing Best Practices FAQ",
      items: [
        {
          question: "When should I send my invoice?",
          answer: "As soon as possible! Most businesses send invoices immediately after a project is completed or at agreed-upon milestones. The sooner you send it, the sooner the payment clock starts ticking.",
        },
        {
          question: "What if a client doesn't pay?",
          answer: "Always follow up. A polite 'Friendly Reminder' email 3 days after a due date is normal. Having a professional invoice from the start makes these conversations much easier.",
        },
      ],
    },
  },
];
