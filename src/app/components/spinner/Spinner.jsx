"use client"

import React from 'react'
import styles from './page.module.css'

const Spinner = () => {
  return (
    <div className={styles.panel}>
      <div className={styles.spinner}></div>
    </div>
  )
}

export default Spinner
