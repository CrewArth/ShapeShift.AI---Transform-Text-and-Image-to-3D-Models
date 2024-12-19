'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import Navbar from '@/components/Navbar'
import AuthCheck from '@/components/auth-check'
import TextTo3DImage from '@/assets/text-to-3d.png'
import ImageTo3DImage from '@/assets/image-to-3d.png'
import ForumImage from '@/assets/forum.png'
import './dashboard.css'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100
    }
  }
}

export default function Dashboard() {
  return (
    <div className="dashboard-wrapper">
      <AuthCheck />
      <Navbar />
      
      <main className="dashboard-main">
        <motion.div
          className="dashboard-container"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1 
            className="dashboard-title"
            variants={itemVariants}
          >
            Welcome to Your Creative Space
          </motion.h1>
          <motion.p
            className="dashboard-subtitle"
            variants={itemVariants}
          >
            Choose your preferred way to create amazing 3D models
          </motion.p>

          <div className="dashboard-grid">
            <motion.div variants={itemVariants}>
              <Link href="/workspace/text-to-3d">
                <motion.div 
                  className="dashboard-card text-to-3d-card"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="card-image-container">
                    <div className="card-image-with-vignette">
                      <Image
                        src={TextTo3DImage}
                        alt="Text to 3D"
                        width={400}
                        height={300}
                        className="object-cover"
                        priority
                      />
                    </div>
                  </div>
                  <div className="card-content">
                    <h2 className="card-title">Text to 3D</h2>
                    <p className="card-description">
                      Transform your text descriptions into stunning 3D models
                    </p>
                  </div>
                </motion.div>
              </Link>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Link href="/workspace/image-to-3d">
                <motion.div 
                  className="dashboard-card image-to-3d-card"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="card-image-container">
                    <div className="card-image-with-vignette">
                      <Image
                        src={ImageTo3DImage}
                        alt="Image to 3D"
                        width={400}
                        height={300}
                        className="object-cover"
                        priority
                      />
                    </div>
                  </div>
                  <div className="card-content">
                    <h2 className="card-title">Image to 3D</h2>
                    <p className="card-description">
                      Convert your images into detailed 3D models
                    </p>
                  </div>
                </motion.div>
              </Link>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Link href="/forum">
                <motion.div 
                  className="dashboard-card forum-card"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="card-image-container">
                    <div className="card-image-with-vignette">
                      <Image
                        src={ForumImage}
                        alt="Community Forum"
                        width={400}
                        height={300}
                        className="object-cover"
                        priority
                      />
                    </div>
                  </div>
                  <div className="card-content">
                    <h2 className="card-title">
                      Forum
                      <span className="new-badge">New</span>
                    </h2>
                    <p className="card-description">
                      Explore and share models with the community
                    </p>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </main>

      <motion.footer 
        className="dashboard-footer"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <div className="footer-content">
          <p className="footer-text">
            © 2024 ShapeShift AI. All rights reserved.
          </p>
          <div className="footer-links">
            <Link href="/privacy" className="footer-link">Privacy Policy</Link>
            <Link href="/terms" className="footer-link">Terms of Service</Link>
            <Link href="/contact" className="footer-link">Contact Us</Link>
          </div>
        </div>
      </motion.footer>
    </div>
  )
} 