import React, { useState } from "react";
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

const defaultUserData = {
  name: "",
  address: "",
  amount: "",
  duration: ""
};

export default function Home() {
  const [userData, setUserData] = useState(defaultUserData);

  const onChangeHandler = (e, target) => {
    const value = e.target.value;
    setUserData({...userData, ...{[target]: value}});
  }

  const onClickHandler = async () => {
    const response = await fetch("/api/generate-invoice", {
      method: 'POST',
      body: JSON.stringify({})
    });
    console.log(" DEBUG: ", "--------------------------->", response);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>ACT Invoice Generator</title>
        <meta name="description" content="Generated invoices easy!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to invoice generator
        </h1>

        <p className={styles.description}>
          For education purposes ONLY!
        </p>

        <div className={styles.grid}>
          {
            Object.keys(defaultUserData).map(item => <div className={styles.card}>
              <h2>{item}:</h2>
              <textarea type="text" value={userData[item]} onChange={(e) => onChangeHandler(e, item)}/>
            </div>)
          }
        </div>
        <button className={styles.generateButton} onClick={onClickHandler}>Generate Invoice</button>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  )
}
