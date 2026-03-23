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
  {
    slug: "consulting-invoice-template",
    metadata: {
      title: "Free Consulting Invoice Template — Professional Billing for Consultants",
      description: "Download a free consulting invoice template. Perfect for management, IT, and business consultants. Itemize hourly rates, retainers, and project fees easily.",
    },
    hero: {
      badge: "Consulting Invoice",
      title: "Professional Invoicing for ",
      highlight: "Consultants",
      description: "Whether you bill hourly or per project, create polished consulting invoices that reflect the quality of your advisory services.",
    },
    overview: {
      title: "Why Consultants Need Great Invoices",
      content: "As a consultant, your invoice is an extension of your professional brand. Clients expect the same level of clarity and precision in your billing as they do in your advice. A well-structured consulting invoice should clearly differentiate between different types of engagement—hourly advisory, fixed-fee projects, and ongoing retainers—while maintaining a clean, executive-level presentation.",
    },
    features: {
      title: "Tailored for Consulting",
      items: [
        {
          title: "Hourly & Retainer Billing",
          description: "Easily switch between hourly rates, fixed project fees, and monthly retainer structures.",
          icon: "zap",
          color: "text-amber-500 bg-amber-50 dark:bg-amber-900/20",
        },
        {
          title: "Executive Presentation",
          description: "Clean, minimal design that conveys professionalism to C-suite clients.",
          icon: "shield",
          color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20",
        },
        {
          title: "Expense Tracking",
          description: "Add travel, software, and other reimbursable expenses as separate line items.",
          icon: "creditCard",
          color: "text-cyan-600 bg-cyan-50 dark:bg-cyan-900/20",
        },
      ],
    },
    exampleInvoice: {
      title: "Sample Consulting Invoice",
      description: "See how a consulting engagement can be clearly itemized with different billing types.",
      data: {
        company: { name: "McKinley Strategy Group\n200 Advisory Blvd, Boston, MA 02101", logo: "", email: "billing@mckinleystrategy.com", address: "200 Advisory Blvd", phone: "617-555-3000" },
        client: { name: "HealthTech Innovations\n900 Biotech Park, San Diego, CA 92121", email: "finance@healthtechinno.com", address: "900 Biotech Park", phone: "858-555-4500" },
        items: [
          { id: "1", description: "Strategic Market Analysis - 40 hours @ $250/hr", quantity: 40, rate: 250 },
          { id: "2", description: "Executive Presentation & Report Delivery", quantity: 1, rate: 1500 },
          { id: "3", description: "Travel Expenses (Client Site Visit)", quantity: 1, rate: 850 },
        ],
        details: { invoiceNumber: "INV-MSG-047", issueDate: new Date().toISOString(), dueDate: new Date().toISOString() },
      },
    },
    faq: {
      title: "Consulting Invoice FAQ",
      items: [
        {
          question: "How should I bill for travel expenses?",
          answer: "Best practice is to list travel as a separate line item with receipts available upon request. This keeps your professional fees transparent and easy to audit.",
        },
        {
          question: "Should I include a detailed time log?",
          answer: "For hourly engagements, yes. Include a summary of hours on the invoice and offer a detailed timesheet as an attachment. This builds trust and reduces payment disputes.",
        },
      ],
    },
  },
  {
    slug: "photography-invoice-template",
    metadata: {
      title: "Free Photography Invoice Template — Bill Clients for Photo Shoots",
      description: "Professional photography invoice templates for weddings, events, portraits, and commercial shoots. Itemize sessions, edits, and prints. Free to use.",
    },
    hero: {
      badge: "Photography Invoice",
      title: "Beautiful Invoices for ",
      highlight: "Photographers",
      description: "Your photos tell a story—your invoices should too. Create professional billing documents that match the quality of your creative work.",
    },
    overview: {
      title: "Invoicing for the Creative Eye",
      content: "Photography billing can be complex—you may charge for a shoot session, post-processing hours, print licenses, and travel. Our template makes it easy to break down each component so clients understand exactly what they're paying for. Whether you're a wedding photographer or a commercial studio, clear invoicing helps you get paid on time and maintain strong client relationships.",
    },
    features: {
      title: "Built for Photographers",
      items: [
        {
          title: "Session & Editing Breakdown",
          description: "Separate shoot time from post-processing hours for complete transparency.",
          icon: "fileText",
          color: "text-blue-600 bg-blue-50 dark:bg-blue-900/20",
        },
        {
          title: "License & Usage Rights",
          description: "Add notes about image licensing, usage rights, and print permissions.",
          icon: "shield",
          color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20",
        },
        {
          title: "Package Pricing",
          description: "Create invoices for preset packages or à la carte services with ease.",
          icon: "zap",
          color: "text-amber-500 bg-amber-50 dark:bg-amber-900/20",
        },
      ],
    },
    exampleInvoice: {
      title: "Sample Photography Invoice",
      description: "A clean breakdown of a wedding photography engagement with editing and prints.",
      data: {
        company: { name: "Lens & Light Studio\n88 Shutter Lane, Nashville, TN 37203", logo: "", email: "hello@lensandlight.com", address: "88 Shutter Lane", phone: "615-555-2200" },
        client: { name: "Sarah & James Thompson\n45 Maple Drive, Franklin, TN 37064", email: "sarah.thompson@email.com", address: "45 Maple Drive", phone: "615-555-8800" },
        items: [
          { id: "1", description: "Wedding Photography - Full Day (8 hours)", quantity: 1, rate: 3500 },
          { id: "2", description: "Photo Editing & Color Grading (200 images)", quantity: 1, rate: 800 },
          { id: "3", description: "Premium Photo Album (12x12, 40 pages)", quantity: 1, rate: 450 },
        ],
        details: { invoiceNumber: "INV-LL-089", issueDate: new Date().toISOString(), dueDate: new Date().toISOString() },
      },
    },
    faq: {
      title: "Photography Invoicing FAQ",
      items: [
        {
          question: "Should I charge separately for editing?",
          answer: "It depends on your business model. Many photographers include basic editing in their session fee and charge extra for advanced retouching. Being transparent about this in your invoice avoids confusion.",
        },
        {
          question: "How do I handle deposits and final payments?",
          answer: "Use the notes section to reference any deposits already paid. Show the deposit as a negative line item or a 'Less: Deposit Paid' entry to clearly show the remaining balance due.",
        },
      ],
    },
  },
  {
    slug: "small-business-invoice-template",
    metadata: {
      title: "Free Small Business Invoice Template — Simple & Professional",
      description: "Free invoice templates designed for small businesses. Easy to customize, professional layouts. Perfect for shops, services, and startups. No signup required.",
    },
    hero: {
      badge: "Small Business",
      title: "Simple Invoicing for ",
      highlight: "Small Businesses",
      description: "You started a business to do what you love, not to wrestle with paperwork. Get professional invoices out the door in under a minute.",
    },
    overview: {
      title: "Invoicing Shouldn't Slow You Down",
      content: "Small business owners wear many hats, and invoicing shouldn't take more than a few minutes. Our templates are pre-structured with everything a small business needs: your company details, client info, itemized services or products, tax calculations, and payment terms. Just fill in the blanks, download the PDF, and send it off. It's that simple.",
    },
    features: {
      title: "Small Business Essentials",
      items: [
        {
          title: "Quick Setup",
          description: "No complex configuration. Enter your details once and start invoicing immediately.",
          icon: "zap",
          color: "text-amber-500 bg-amber-50 dark:bg-amber-900/20",
        },
        {
          title: "Tax Ready",
          description: "Built-in tax calculation fields so your invoices are compliant from day one.",
          icon: "creditCard",
          color: "text-cyan-600 bg-cyan-50 dark:bg-cyan-900/20",
        },
        {
          title: "Multi-Currency",
          description: "Bill international clients in their preferred currency with easy currency switching.",
          icon: "globe",
          color: "text-violet-600 bg-violet-50 dark:bg-violet-900/20",
        },
      ],
    },
    exampleInvoice: {
      title: "Small Business Invoice Example",
      description: "A straightforward invoice for a local service business — clean, simple, and effective.",
      data: {
        company: { name: "Green Thumb Landscaping\n340 Garden Way, Portland, OR 97205", logo: "", email: "info@greenthumbpdx.com", address: "340 Garden Way", phone: "503-555-7700" },
        client: { name: "Riverside Apartments\n120 River Rd, Portland, OR 97201", email: "manager@riversideapts.com", address: "120 River Rd", phone: "503-555-3300" },
        items: [
          { id: "1", description: "Monthly Lawn Maintenance", quantity: 1, rate: 350 },
          { id: "2", description: "Spring Flower Bed Installation", quantity: 1, rate: 1200 },
          { id: "3", description: "Irrigation System Repair", quantity: 2, rate: 175 },
        ],
        details: { invoiceNumber: "INV-GT-2026-03", issueDate: new Date().toISOString(), dueDate: new Date().toISOString() },
      },
    },
    faq: {
      title: "Small Business Invoicing FAQ",
      items: [
        {
          question: "Do I need a business license number on my invoice?",
          answer: "Requirements vary by location. In many jurisdictions, including your business registration or license number adds credibility and may be legally required for tax purposes.",
        },
        {
          question: "How do I handle late payments?",
          answer: "Include clear payment terms (e.g., 'Net 15' or 'Due on Receipt') on every invoice. You can also add a late payment fee policy in the notes section to encourage timely payment.",
        },
      ],
    },
  },
  {
    slug: "proforma-invoice-template",
    metadata: {
      title: "Free Proforma Invoice Template — Pre-Sales Quotation Document",
      description: "Create professional proforma invoices for international trade, customs, and pre-sales estimates. Free template with no signup required.",
    },
    hero: {
      badge: "Proforma Invoice",
      title: "Professional ",
      highlight: "Proforma Invoices",
      description: "Need to provide a pre-sales estimate or customs declaration? Create accurate proforma invoices that pave the way for smooth transactions.",
    },
    overview: {
      title: "What is a Proforma Invoice?",
      content: "A proforma invoice is a preliminary document sent before a sale is finalized. It's commonly used in international trade for customs declarations, import/export documentation, and as a formal price quotation. Unlike a standard invoice, a proforma is not a demand for payment—it's a good-faith estimate that helps both buyer and seller agree on terms before committing to a transaction.",
    },
    features: {
      title: "Proforma Essentials",
      items: [
        {
          title: "Pre-Sale Estimates",
          description: "Provide detailed cost breakdowns before finalizing a deal to set clear expectations.",
          icon: "fileText",
          color: "text-blue-600 bg-blue-50 dark:bg-blue-900/20",
        },
        {
          title: "Customs & Trade Ready",
          description: "Include HS codes, country of origin, and shipping terms for international shipments.",
          icon: "globe",
          color: "text-violet-600 bg-violet-50 dark:bg-violet-900/20",
        },
        {
          title: "Convert to Invoice",
          description: "Easily convert your proforma into a final invoice once the deal is confirmed.",
          icon: "zap",
          color: "text-amber-500 bg-amber-50 dark:bg-amber-900/20",
        },
      ],
    },
    exampleInvoice: {
      title: "Proforma Invoice Example",
      description: "A proforma for an international trade transaction with itemized goods and shipping details.",
      data: {
        company: { name: "Pacific Export Co.\n1500 Harbor Blvd, Long Beach, CA 90802", logo: "", email: "exports@pacificexport.com", address: "1500 Harbor Blvd", phone: "562-555-9100" },
        client: { name: "EuroTrade GmbH\nIndustriestraße 42, 60329 Frankfurt, Germany", email: "procurement@eurotrade.de", address: "Industriestraße 42", phone: "+49 69 555 2200" },
        items: [
          { id: "1", description: "Organic Green Tea - 500kg (HS Code: 0902.10)", quantity: 500, rate: 12 },
          { id: "2", description: "International Freight (FOB Long Beach)", quantity: 1, rate: 2800 },
          { id: "3", description: "Export Documentation & Certification", quantity: 1, rate: 350 },
        ],
        details: { invoiceNumber: "PI-2026-0088", issueDate: new Date().toISOString(), dueDate: new Date().toISOString() },
      },
    },
    faq: {
      title: "Proforma Invoice FAQ",
      items: [
        {
          question: "Is a proforma invoice legally binding?",
          answer: "No, a proforma invoice is not a legally binding demand for payment. It's a preliminary estimate or quotation. Once both parties agree, a formal commercial invoice should be issued.",
        },
        {
          question: "When should I use a proforma invoice?",
          answer: "Use proformas for international trade customs declarations, when a buyer requests a formal quote before purchase, or when you need to provide cost estimates for budgeting or financing purposes.",
        },
      ],
    },
  },
  {
    slug: "service-invoice-template",
    metadata: {
      title: "Free Service Invoice Template — Bill for Professional Services",
      description: "Create service invoices for any professional service business. Perfect for plumbers, electricians, cleaners, lawyers, and more. Free, no signup.",
    },
    hero: {
      badge: "Service Invoice",
      title: "Invoicing for ",
      highlight: "Service Professionals",
      description: "From home repairs to legal advice—create clean, professional invoices for any service-based business in seconds.",
    },
    overview: {
      title: "Billing for Services Done Right",
      content: "Service businesses have unique invoicing needs. You might charge by the hour, per visit, or per project. You may need to account for parts and materials alongside labor. Our service invoice template handles all of these scenarios with a flexible layout that keeps your billing clear and professional, no matter what service you provide.",
    },
    features: {
      title: "Service Business Ready",
      items: [
        {
          title: "Labor & Materials",
          description: "Clearly separate service charges from parts or materials used on the job.",
          icon: "fileText",
          color: "text-blue-600 bg-blue-50 dark:bg-blue-900/20",
        },
        {
          title: "Service Descriptions",
          description: "Add detailed descriptions of work performed for full transparency.",
          icon: "users",
          color: "text-pink-600 bg-pink-50 dark:bg-pink-900/20",
        },
        {
          title: "Warranty & Guarantee Notes",
          description: "Include warranty periods and service guarantees directly on your invoice.",
          icon: "shield",
          color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20",
        },
      ],
    },
    exampleInvoice: {
      title: "Service Invoice Example",
      description: "A plumbing service invoice showing labor, parts, and a clear total.",
      data: {
        company: { name: "QuickFix Plumbing\n78 Pipe Lane, Houston, TX 77001", logo: "", email: "service@quickfixplumbing.com", address: "78 Pipe Lane", phone: "713-555-4400" },
        client: { name: "Oak Park Community Center\n200 Community Dr, Houston, TX 77005", email: "facilities@oakparkcenter.org", address: "200 Community Dr", phone: "713-555-6600" },
        items: [
          { id: "1", description: "Emergency Pipe Repair - Labor (3 hours)", quantity: 3, rate: 120 },
          { id: "2", description: "PVC Pipe Fittings & Connectors", quantity: 1, rate: 85 },
          { id: "3", description: "Water Heater Inspection & Flush", quantity: 1, rate: 150 },
        ],
        details: { invoiceNumber: "SVC-2026-0331", issueDate: new Date().toISOString(), dueDate: new Date().toISOString() },
      },
    },
    faq: {
      title: "Service Invoicing FAQ",
      items: [
        {
          question: "Should I charge a call-out fee?",
          answer: "Many service professionals charge a call-out or dispatch fee to cover travel time and fuel. List it as a separate line item on your invoice for transparency.",
        },
        {
          question: "How do I invoice for recurring services?",
          answer: "For regular clients, you can create a recurring invoice with the same line items each period. Our Pro plan includes automated recurring invoices to save you even more time.",
        },
      ],
    },
  },
  {
    slug: "simple-invoice-template",
    metadata: {
      title: "Free Simple Invoice Template — Clean & Easy to Use",
      description: "Download a free simple invoice template that's clean, easy to fill out, and perfect for any business. No clutter, no confusion — just a simple invoice.",
    },
    hero: {
      badge: "Simple Invoice",
      title: "Keep Invoicing ",
      highlight: "Simple",
      description: "Not every business needs a complex billing system. Our simple invoice template is clean, fast, and gets straight to the point.",
    },
    overview: {
      title: "Why Simple Works Best",
      content: "The best invoice is one that clients actually read and pay. A cluttered, over-designed invoice can confuse clients and delay payment. Our simple invoice template strips away the noise and focuses on what matters: who's billing, who's paying, what for, and how much. It's designed for speed — both for you to create and for your client to process.",
    },
    features: {
      title: "Beautifully Simple",
      items: [
        {
          title: "Minimal Layout",
          description: "Clean typography, generous whitespace, and a logical flow that guides the eye naturally.",
          icon: "fileText",
          color: "text-blue-600 bg-blue-50 dark:bg-blue-900/20",
        },
        {
          title: "Fill & Download",
          description: "No account needed. Just fill in your details and download a professional PDF in seconds.",
          icon: "zap",
          color: "text-amber-500 bg-amber-50 dark:bg-amber-900/20",
        },
        {
          title: "Works Everywhere",
          description: "Our simple template looks perfect on desktop, tablet, and mobile devices.",
          icon: "globe",
          color: "text-violet-600 bg-violet-50 dark:bg-violet-900/20",
        },
      ],
    },
    exampleInvoice: {
      title: "Simple Invoice Example",
      description: "Clean, uncluttered, and to the point — exactly what a client wants to see.",
      data: {
        company: { name: "Clean Code Studio\n22 Dev Lane, Austin, TX 78701", logo: "", email: "hello@cleancode.io", address: "22 Dev Lane", phone: "512-555-1100" },
        client: { name: "Startup Labs Inc\n100 Innovation Way, San Jose, CA 95110", email: "billing@startuplabs.com", address: "100 Innovation Way", phone: "408-555-2200" },
        items: [
          { id: "1", description: "Website Development", quantity: 1, rate: 4500 },
          { id: "2", description: "Monthly Hosting & Support", quantity: 1, rate: 150 },
        ],
        details: { invoiceNumber: "INV-SIMPLE-01", issueDate: new Date().toISOString(), dueDate: new Date().toISOString() },
      },
    },
    faq: {
      title: "Simple Invoice FAQ",
      items: [
        {
          question: "What makes a simple invoice different?",
          answer: "A simple invoice focuses on essential information only: your details, client details, line items, and total. No unnecessary fields, no visual clutter — just clean, professional billing.",
        },
        {
          question: "Is a simple invoice still legally valid?",
          answer: "Absolutely. As long as your invoice includes a unique number, date, your business details, client details, description of services, amount due, and payment terms, it's legally valid regardless of design complexity.",
        },
      ],
    },
  },
  {
    slug: "commercial-invoice-template",
    metadata: {
      title: "Free Commercial Invoice Template — For International Trade & Customs",
      description: "Generate professional commercial invoices for international shipping and customs clearance. Free template with HS codes, country of origin, and trade terms.",
    },
    hero: {
      badge: "Commercial Invoice",
      title: "Professional ",
      highlight: "Commercial Invoices",
      description: "Shipping goods internationally? Create commercial invoices that meet customs requirements and streamline your cross-border transactions.",
    },
    overview: {
      title: "What is a Commercial Invoice?",
      content: "A commercial invoice is a legal document required for international trade. It serves as a customs declaration and provides details about the goods being shipped, their value, the buyer, the seller, and the terms of sale. Customs authorities use commercial invoices to assess duties and taxes, so accuracy is critical. Our template ensures you include all the required information for smooth customs clearance.",
    },
    features: {
      title: "Trade-Ready Features",
      items: [
        {
          title: "Customs Compliant",
          description: "Include HS codes, country of origin, Incoterms, and declared values for customs clearance.",
          icon: "globe",
          color: "text-violet-600 bg-violet-50 dark:bg-violet-900/20",
        },
        {
          title: "Multi-Currency",
          description: "Bill in any currency with automatic formatting for international transactions.",
          icon: "creditCard",
          color: "text-cyan-600 bg-cyan-50 dark:bg-cyan-900/20",
        },
        {
          title: "Detailed Item Descriptions",
          description: "Add weight, dimensions, quantity, and unit price for each item in the shipment.",
          icon: "fileText",
          color: "text-blue-600 bg-blue-50 dark:bg-blue-900/20",
        },
      ],
    },
    exampleInvoice: {
      title: "Commercial Invoice Example",
      description: "A complete commercial invoice for an international shipment with customs-ready details.",
      data: {
        company: { name: "American Textile Exports\n2200 Commerce Dr, Dallas, TX 75201", logo: "", email: "exports@amtextile.com", address: "2200 Commerce Dr", phone: "214-555-8800" },
        client: { name: "London Fashion House Ltd\n45 Oxford Street, London W1D 2DZ, UK", email: "procurement@londonfashion.co.uk", address: "45 Oxford Street", phone: "+44 20 5555 3300" },
        items: [
          { id: "1", description: "Premium Cotton Fabric - 1000m (HS: 5208.21)", quantity: 1000, rate: 8 },
          { id: "2", description: "Silk Blend Material - 200m (HS: 5007.20)", quantity: 200, rate: 35 },
          { id: "3", description: "Freight & Insurance (CIF London)", quantity: 1, rate: 4200 },
        ],
        details: { invoiceNumber: "CI-2026-0142", issueDate: new Date().toISOString(), dueDate: new Date().toISOString() },
      },
    },
    faq: {
      title: "Commercial Invoice FAQ",
      items: [
        {
          question: "Is a commercial invoice the same as a regular invoice?",
          answer: "No. A regular invoice is a request for payment between buyer and seller. A commercial invoice serves a dual purpose — it's both a billing document and a customs declaration required for international shipments.",
        },
        {
          question: "What information must a commercial invoice include?",
          answer: "Buyer and seller details, description of goods, HS/tariff codes, country of origin, quantity, unit value, total value, currency, Incoterms (shipping terms like FOB or CIF), and the reason for export.",
        },
      ],
    },
  },
  {
    slug: "invoice-generator-with-logo",
    metadata: {
      title: "Free Invoice Generator with Logo — Add Your Brand Identity",
      description: "Create invoices with your company logo for free. Upload your logo, customize your invoice, and download a branded PDF. No signup, no watermark.",
    },
    hero: {
      badge: "Invoice with Logo",
      title: "Create Branded Invoices ",
      highlight: "with Your Logo",
      description: "Stand out from generic invoices. Upload your company logo and create professional, branded invoices that clients remember.",
    },
    overview: {
      title: "Why Your Logo Matters on Invoices",
      content: "Your invoice is often the last touchpoint with a client after delivering work. A branded invoice with your logo reinforces your professional identity and builds trust. Studies show that branded documents get paid faster because they look more legitimate and memorable. Our free invoice generator lets you upload any logo — PNG, JPG, or SVG — and positions it perfectly on your invoice.",
    },
    features: {
      title: "Brand Your Invoices",
      items: [
        {
          title: "Easy Logo Upload",
          description: "Drag and drop your logo or click to upload. Supports PNG, JPG, SVG, and WebP formats.",
          icon: "zap",
          color: "text-amber-500 bg-amber-50 dark:bg-amber-900/20",
        },
        {
          title: "Perfect Positioning",
          description: "Your logo is automatically sized and positioned in the header for a polished, professional look.",
          icon: "fileText",
          color: "text-blue-600 bg-blue-50 dark:bg-blue-900/20",
        },
        {
          title: "Save for Reuse",
          description: "Create a free account to save your company profile with logo for instant invoicing next time.",
          icon: "users",
          color: "text-pink-600 bg-pink-50 dark:bg-pink-900/20",
        },
      ],
    },
    exampleInvoice: {
      title: "Branded Invoice Example",
      description: "See how a logo transforms an ordinary invoice into a professional brand touchpoint.",
      data: {
        company: { name: "Bright Spark Marketing\n55 Brand Ave, Miami, FL 33101", logo: "", email: "hello@brightspark.co", address: "55 Brand Ave", phone: "305-555-7700" },
        client: { name: "Oceanview Hotels Group\n800 Beach Blvd, Fort Lauderdale, FL 33304", email: "finance@oceanviewhotels.com", address: "800 Beach Blvd", phone: "954-555-3300" },
        items: [
          { id: "1", description: "Social Media Campaign - Q1 2026", quantity: 1, rate: 5500 },
          { id: "2", description: "Brand Photography (50 images)", quantity: 1, rate: 2000 },
          { id: "3", description: "Google Ads Management (Monthly)", quantity: 1, rate: 1200 },
        ],
        details: { invoiceNumber: "INV-BSM-026", issueDate: new Date().toISOString(), dueDate: new Date().toISOString() },
      },
    },
    faq: {
      title: "Logo Invoice FAQ",
      items: [
        {
          question: "What logo format works best?",
          answer: "PNG with a transparent background works best for most invoices. SVG files also work perfectly. We recommend a logo that's at least 200px wide for crisp results on the PDF.",
        },
        {
          question: "Can I use this for free without a watermark?",
          answer: "Yes! Unlike other invoice generators, we never add watermarks to your PDFs — even on the free plan. Your brand is the only one that appears on your invoice.",
        },
      ],
    },
  },
  {
    slug: "google-docs-invoice-template",
    metadata: {
      title: "Google Docs Invoice Template Alternative — Why Online Generators Are Better",
      description: "Looking for a Google Docs invoice template? Discover why a dedicated free invoice generator creates better results than Google Docs — with live preview, auto math, and instant PDF.",
    },
    hero: {
      badge: "Better than Google Docs",
      title: "Skip Google Docs. Use a ",
      highlight: "Real Invoice Generator",
      description: "Google Docs wasn't built for invoicing. Switch to a purpose-built tool that handles formatting, math, and PDF export automatically.",
    },
    overview: {
      title: "Google Docs vs Dedicated Invoice Generator",
      content: "Many freelancers start with Google Docs invoice templates because it's free and familiar. But Google Docs has limitations: manual math calculations, inconsistent formatting across devices, no automatic numbering, and clunky PDF exports. A dedicated invoice generator like Invoice-Quickly gives you live preview, automatic tax calculations, professional PDF output, and the ability to save client details — all for free. It's everything Google Docs can't do for invoicing.",
    },
    features: {
      title: "Why Switch from Google Docs?",
      items: [
        {
          title: "Automatic Calculations",
          description: "No more manual math or broken formulas. Taxes, discounts, and totals update instantly.",
          icon: "zap",
          color: "text-amber-500 bg-amber-50 dark:bg-amber-900/20",
        },
        {
          title: "Professional PDF Export",
          description: "One-click PDF download that looks perfect every time — no page break issues or font problems.",
          icon: "fileText",
          color: "text-blue-600 bg-blue-50 dark:bg-blue-900/20",
        },
        {
          title: "Built-In Client Management",
          description: "Save client details and company profiles for instant reuse. No copying between documents.",
          icon: "users",
          color: "text-pink-600 bg-pink-50 dark:bg-pink-900/20",
        },
      ],
    },
    exampleInvoice: {
      title: "Professional Invoice (No Google Docs Needed)",
      description: "Compare this clean, automatically formatted invoice to a typical Google Docs template.",
      data: {
        company: { name: "Digital Nomad Studio\n Remote Worldwide", logo: "", email: "hello@nomadstudio.dev", address: "Remote", phone: "+1 555-0199" },
        client: { name: "TechCorp Solutions\n1200 Enterprise Way, San Francisco, CA 94105", email: "ap@techcorp.com", address: "1200 Enterprise Way", phone: "415-555-9900" },
        items: [
          { id: "1", description: "Full-Stack Web Application Development", quantity: 1, rate: 8000 },
          { id: "2", description: "API Integration & Testing", quantity: 1, rate: 2500 },
          { id: "3", description: "30-Day Post-Launch Support", quantity: 1, rate: 1000 },
        ],
        details: { invoiceNumber: "INV-DNS-2026-03", issueDate: new Date().toISOString(), dueDate: new Date().toISOString() },
      },
    },
    faq: {
      title: "Google Docs vs Invoice Generator FAQ",
      items: [
        {
          question: "Can I import my Google Docs template?",
          answer: "You don't need to! Our generator is faster than filling out a Google Docs template. Just enter your details in our form and you'll have a professional invoice in under 60 seconds.",
        },
        {
          question: "Is this really free like Google Docs?",
          answer: "Yes — our core invoice generator is 100% free with no watermarks and no signup required. Unlike Google Docs, it's purpose-built for invoicing with live preview, auto calculations, and professional PDF output.",
        },
      ],
    },
  },
];

