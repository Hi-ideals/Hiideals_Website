import { doc, setDoc, getDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from './config'

const seedDocuments = {
  // Admin whitelist — uses email as doc ID
  admins: {
    'hiidealstechnologies@gmail.com': { name: 'Hiideals Technologies', role: 'super_admin', active: true, createdAt: new Date() },
  },

  // Site Settings
  site_settings: {
    general: {
      companyName: 'Hiideals Technologies',
      tagline: 'Building premium software solutions that drive digital transformation.',
      email: 'info@hiideals.com',
      phone: '+91 XXXXX XXXXX',
      address: 'Bidar, Karnataka, India',
      founded: '2015',
    },
    homepage: {
      showServices: true,
      showProducts: true,
      showTestimonials: true,
      showBlog: true,
      showCareers: true,
      heroBadge: 'Software Company in Bidar, Karnataka',
      heroTitle1: 'We Build Software',
      heroTitle2: 'That Drives Growth',
      heroDescription: 'We craft premium digital experiences — from enterprise platforms to mobile apps and cloud infrastructure. Based in Bidar, serving clients worldwide.',
    },
    seo: {
      metaTitle: 'Hiideals Technologies — Software Solutions',
      metaDescription: 'Hiideals Technologies delivers innovative software solutions from Bidar, Karnataka. Web, mobile, cloud and more.',
      ogImage: '',
    },
  },

  // Products
  products: {
    'sample-product': {
      name: 'GymOS',
      tagline: 'Multi-tenant gym management SaaS',
      description: 'Complete gym management platform with member tracking, billing, trainer scheduling, and analytics dashboard.',
      category: 'SaaS',
      status: 'Live',
      image: '',
      url: '',
      tech: ['React', 'Firebase', 'Tailwind CSS'],
      active: true,
      order: 1,
      createdAt: new Date(),
    },
  },

  // Services
  services: {
    'web-development': {
      icon: 'code',
      title: 'Web Development',
      description: 'Custom web applications using React, Next.js, Node.js, and more.',
      features: ['Single Page Apps', 'E-commerce', 'CMS Platforms', 'Admin Dashboards'],
      active: true,
      order: 1,
      createdAt: new Date(),
    },
    'mobile-development': {
      icon: 'mobile',
      title: 'Mobile Development',
      description: 'Cross-platform and native apps for iOS and Android.',
      features: ['React Native', 'Flutter', 'iOS Native', 'Android Native'],
      active: true,
      order: 2,
      createdAt: new Date(),
    },
    'cloud-devops': {
      icon: 'cloud',
      title: 'Cloud & DevOps',
      description: 'Cloud infrastructure, CI/CD pipelines, and container orchestration.',
      features: ['AWS / GCP / Azure', 'Docker & K8s', 'CI/CD Pipelines', 'Monitoring'],
      active: true,
      order: 3,
      createdAt: new Date(),
    },
    'cybersecurity': {
      icon: 'shield',
      title: 'Cybersecurity',
      description: 'Security audits, vulnerability assessments, and compliance.',
      features: ['Penetration Testing', 'Code Audits', 'Compliance', 'Training'],
      active: true,
      order: 4,
      createdAt: new Date(),
    },
  },

  // Team
  team: {
    'sample-member': {
      name: 'Omkar',
      role: 'Founder & CEO',
      bio: 'Passionate about building great software and empowering businesses through technology.',
      photo: '',
      linkedin: '',
      github: '',
      active: true,
      order: 1,
      createdAt: new Date(),
    },
  },

  // Testimonials
  testimonials: {
    'sample-testimonial': {
      name: 'Satisfied Client',
      company: 'TechCorp',
      role: 'CTO',
      content: 'Hiideals Technologies delivered an exceptional product that exceeded our expectations. Their team is professional, responsive, and highly skilled.',
      rating: 5,
      photo: '',
      active: true,
      order: 1,
      createdAt: new Date(),
    },
  },

  // Blog Posts
  blog_posts: {
    'welcome-post': {
      title: 'Welcome to Hiideals Technologies Blog',
      slug: 'welcome-to-hiideals',
      excerpt: 'Stay tuned for tech insights, company updates, and industry trends from our team.',
      content: 'We are excited to launch our blog! Here we will share tech insights, company updates, tutorials, and industry trends. Follow along as we grow.',
      author: 'Hiideals Team',
      image: '',
      tags: ['announcement', 'company'],
      published: true,
      active: true,
      publishedAt: new Date(),
      createdAt: new Date(),
    },
  },

  // Careers
  careers: {
    'sample-job': {
      title: 'Full Stack Developer',
      type: 'Full-time',
      location: 'Bidar / Remote',
      department: 'Engineering',
      description: 'Build and maintain web applications using React and Node.js.',
      requirements: ['3+ years experience', 'React, Node.js proficiency', 'PostgreSQL/MongoDB', 'Git workflow'],
      salary: 'Competitive',
      applyUrl: '',
      active: true,
      order: 1,
      createdAt: new Date(),
    },
  },

  // Internships
  internships: {
    'sample-internship': {
      title: 'Frontend Development Intern',
      duration: '3 months',
      location: 'Bidar / Remote',
      department: 'Engineering',
      description: 'Learn and contribute to real-world React projects under senior developer mentorship.',
      requirements: ['Basic React knowledge', 'HTML/CSS/JS fundamentals', 'Eagerness to learn'],
      stipend: 'Performance-based',
      active: true,
      order: 1,
      createdAt: new Date(),
    },
  },

  // Notifications
  notifications: {
    'welcome-notification': {
      title: 'Admin Panel Setup Complete',
      message: 'Your Hiideals Technologies admin panel is ready. Start managing your website content.',
      type: 'info',
      read: false,
      active: true,
      createdAt: new Date(),
    },
  },

  // Campaigns
  campaigns: {
    'sample-campaign': {
      name: 'Launch Announcement',
      description: 'Website launch announcement campaign.',
      type: 'email',
      status: 'draft',
      audience: 'all',
      content: '',
      active: true,
      createdAt: new Date(),
    },
  },

  // Form Submissions
  form_submissions: {
    'sample-submission': {
      formType: 'contact',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+91 9876543210',
      subject: 'Project Inquiry',
      message: 'I am interested in building a web application for my business.',
      read: false,
      createdAt: new Date(),
    },
  },

  // Job Applications
  job_applications: {
    'sample-application': {
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '+91 9876543210',
      position: 'Full Stack Developer',
      experience: '3 years',
      resumeUrl: '',
      coverLetter: 'I am excited to apply for the Full Stack Developer position at Hiideals Technologies.',
      status: 'pending',
      read: false,
      createdAt: new Date(),
    },
  },

  // Internship Applications
  internship_applications: {
    'sample-intern-application': {
      name: 'Rahul Kumar',
      email: 'rahul@example.com',
      phone: '+91 9876543210',
      position: 'Frontend Development Intern',
      college: 'Bidar Engineering College',
      year: '3rd Year',
      resumeUrl: '',
      whyJoin: 'I want to gain real-world experience in React development and learn from experienced developers.',
      status: 'pending',
      read: false,
      createdAt: new Date(),
    },
  },

  // Messages (from contact form)
  messages: {
    'sample-message': {
      name: 'Client Name',
      email: 'client@company.com',
      phone: '+91 9876543210',
      subject: 'Partnership Inquiry',
      message: 'We would like to discuss a potential partnership with Hiideals Technologies for our upcoming project.',
      read: false,
      createdAt: new Date(),
    },
  },
}

/**
 * Seeds Firestore with initial data.
 * Only writes documents that don't already exist (safe to call multiple times).
 * Pass the current user's email to auto-add them as admin.
 */
export async function seedFirestore(currentUserEmail = null) {
  let seeded = 0
  let skipped = 0

  for (const [collectionName, documents] of Object.entries(seedDocuments)) {
    for (const [docId, data] of Object.entries(documents)) {
      try {
        const docRef = doc(db, collectionName, docId)
        const existing = await getDoc(docRef)
        if (!existing.exists()) {
          await setDoc(docRef, data)
          seeded++
        } else {
          skipped++
        }
      } catch (err) {
        console.warn(`Failed to seed ${collectionName}/${docId}:`, err.message)
      }
    }
  }

  // Auto-add current user as admin if email provided
  if (currentUserEmail) {
    try {
      const adminRef = doc(db, 'admins', currentUserEmail)
      const existing = await getDoc(adminRef)
      if (!existing.exists()) {
        await setDoc(adminRef, {
          name: 'Site Owner',
          role: 'super_admin',
          active: true,
          createdAt: new Date(),
        })
        seeded++
        console.log(`Added ${currentUserEmail} as admin`)
      }
    } catch (err) {
      console.warn('Failed to add admin:', err.message)
    }
  }

  console.log(`Seed complete: ${seeded} created, ${skipped} already existed`)
  return { seeded, skipped }
}
