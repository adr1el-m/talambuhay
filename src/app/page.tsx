'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import AnimatedSection from './components/AnimatedSection';

export default function Home() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  return (
    <main className="bg-black text-white" ref={containerRef}>
      {/* Hero Section */}
      <section className="h-screen w-full flex items-center justify-center relative overflow-hidden">
        {/* Glowing orb background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[100px] animate-pulse delay-300" />
        
        {/* Name with glass effect */}
        <h1 className="glass-text wiggle relative z-10">
          Adriel Magalona
        </h1>
      </section>

      {/* Nickname Section */}
      <section className="h-screen w-full flex flex-col items-center justify-center relative overflow-hidden">
        {/* Glowing orb background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-[80px] animate-pulse delay-300" />
        
        {/* Nickname with animations */}
          <motion.div
          className="text-center space-y-6"
          initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.32, 0.72, 0, 1] }}
          viewport={{ once: false }}
        >
          <motion.p 
            className="text-2xl text-gray-400 tracking-widest uppercase"
            style={{
              opacity: useTransform(scrollYProgress, [0.1, 0.2, 0.3], [0, 1, 1]),
              y: useTransform(scrollYProgress, [0.1, 0.2, 0.3], [20, 0, 0])
            }}
          >
            Palayaw
          </motion.p>
          <motion.h2 
            className="glass-text"
            style={{
              scale: useTransform(scrollYProgress, [0.1, 0.2, 0.3], [0.9, 1, 1]),
              opacity: useTransform(scrollYProgress, [0.1, 0.2, 0.3], [0, 1, 1])
            }}
          >
            Dags o Dagi
          </motion.h2>
              </motion.div>
      </section>

      {/* Introduction Section */}
      <AnimatedSection 
        index={1} 
        className="bg-apple-gray"
        hasParallax
      >
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="heading-text">The Beginning</h2>
            <p className="body-text">
              Every great story starts somewhere. Mine began with a curiosity for technology
              and a passion for creating meaningful experiences.
            </p>
          </div>
          <div className="glow">
            <div className="glass-card p-8 hover-lift">
              <h3 className="text-2xl font-semibold mb-4">Key Highlights</h3>
              <ul className="space-y-4 text-gray-300">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
                  First Line of Code
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-purple-400 rounded-full mr-3"></span>
                  Early Achievements
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-pink-400 rounded-full mr-3"></span>
                  Defining Moments
                </li>
              </ul>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Education Section */}
      <AnimatedSection 
        index={2}
        hasParallax
        bgImage="/education-bg.jpg"
      >
        <div className="space-y-12">
          <div className="text-center">
            <h2 className="heading-text">Education</h2>
            <p className="body-text mt-4">Building the foundation for excellence</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                year: '2021-Present',
                title: 'Computer Science',
                institution: 'University Name'
              },
              {
                year: '2019-2021',
                title: 'Web Development',
                institution: 'Tech Institute'
              },
              {
                year: '2017-2019',
                title: 'Digital Arts',
                institution: 'Design School'
              }
            ].map((edu, i) => (
              <div key={i} className="glass-card p-6 hover-lift">
                <div className="text-sm text-blue-400 mb-2">{edu.year}</div>
                <h3 className="text-xl font-semibold mb-2">{edu.title}</h3>
                <p className="text-gray-400">{edu.institution}</p>
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Skills Section */}
      <AnimatedSection 
        index={3} 
        className="bg-apple-gray"
        hasParallax
      >
        <div className="space-y-12">
          <div className="text-center">
            <h2 className="heading-text">Skills & Expertise</h2>
            <p className="body-text mt-4">Mastering the tools of tomorrow</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              'Frontend Development',
              'Backend Architecture',
              'UI/UX Design',
              'Cloud Computing',
              'Mobile Development',
              'Database Management',
              'API Integration',
              'System Design'
            ].map((skill, i) => (
              <div key={i} className="glass-card p-6 text-center hover-lift">
                <div className="text-xl font-medium">{skill}</div>
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Experience Section */}
      <AnimatedSection 
        index={4}
        hasParallax
        bgImage="/experience-bg.jpg"
      >
        <div className="space-y-12">
          <div className="text-center">
            <h2 className="heading-text">Experience</h2>
            <p className="body-text mt-4">Creating impact through innovation</p>
          </div>
          <div className="space-y-6">
            {[
              {
                role: 'Senior Developer',
                company: 'Tech Corp',
                period: '2022-Present',
                description: 'Leading innovative projects and mentoring teams.'
              },
              {
                role: 'Full Stack Developer',
                company: 'Digital Solutions',
                period: '2020-2022',
                description: 'Building scalable web applications and services.'
              }
            ].map((exp, i) => (
              <div key={i} className="glass-card p-6 hover-lift">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold">{exp.role}</h3>
                    <p className="text-gray-400">{exp.company}</p>
                  </div>
                  <div className="text-blue-400">{exp.period}</div>
                </div>
                <p className="mt-4 text-gray-300">{exp.description}</p>
              </div>
              ))}
            </div>
        </div>
      </AnimatedSection>

      {/* Projects Section */}
      <AnimatedSection 
        index={5} 
        className="bg-apple-gray"
        hasParallax
      >
        <div className="space-y-12">
          <div className="text-center">
            <h2 className="heading-text">Featured Projects</h2>
            <p className="body-text mt-4">Bringing ideas to life</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: 'Project Alpha',
                description: 'A revolutionary app that transforms how we work.',
                tech: ['React', 'Node.js', 'AWS']
              },
              {
                title: 'Project Beta',
                description: 'Innovative solution for modern challenges.',
                tech: ['Vue', 'Python', 'Docker']
              }
            ].map((project, i) => (
              <div key={i} className="glass-card p-6 hover-lift">
                <h3 className="text-2xl font-semibold mb-4">{project.title}</h3>
                <p className="text-gray-300 mb-4">{project.description}</p>
                <div className="flex gap-2">
                  {project.tech.map((tech, j) => (
                    <span key={j} className="px-3 py-1 rounded-full glass-button text-sm">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Contact Section */}
      <AnimatedSection 
        index={6}
        hasParallax
        bgImage="/contact-bg.jpg"
      >
        <div className="text-center space-y-8">
          <h2 className="heading-text">Let's Connect</h2>
          <p className="body-text">Ready to start a conversation?</p>
          <div className="flex justify-center gap-4">
            <button className="glass-button px-6 py-3 rounded-full">
              Send Message
            </button>
            <button className="glass-button px-6 py-3 rounded-full">
              Download CV
            </button>
          </div>
      </div>
      </AnimatedSection>
    </main>
  );
}
