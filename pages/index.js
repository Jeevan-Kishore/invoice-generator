import React, { useState } from "react";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";

const defaultUserData = {
  name: "",
  address: "",
  amount: "",
  duration: "",
  mobile: "",
  userId: "",
  accountNumber: "",
};

export default function Home() {
  const [userData, setUserData] = useState(defaultUserData);

  const onChangeHandler = (e, target) => {
    const value = e.target.value;
    setUserData({ ...userData, ...{ [target]: value } });
  };

  const onClickHandler = async () => {
    const response = await fetch("/api/generate-invoice", {
      method: "POST",
      body: JSON.stringify({ ...userData }),
    });
    const blob = await response.blob();
    // It is necessary to create a new blob object with mime-type explicitly set for all browsers except Chrome, but it works for Chrome too.
    const newBlob = new Blob([blob], { type: "text/html" });

    // MS Edge and IE don't allow using a blob object directly as link href, instead it is necessary to use msSaveOrOpenBlob
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(newBlob);
    } else {
      // For other browsers: create a link pointing to the ObjectURL containing the blob.
      const objUrl = window.URL.createObjectURL(newBlob);

      let link = document.createElement("a");
      link.href = objUrl;
      link.download = `ACT-receipt-${new Date().getTime()}`;
      link.click();

      // For Firefox it is necessary to delay revoking the ObjectURL.
      setTimeout(() => {
        window.URL.revokeObjectURL(objUrl);
      }, 250);
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>ACT Invoice Generator</title>
        <meta name="description" content="Generated invoices easy!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Welcome to invoice generator</h1>

        <p className={styles.description}>For education purposes ONLY!</p>

        <div className={styles.grid}>
          {Object.keys(defaultUserData).map((item, index) => (
            <div key={`${item}-${index}`} className={styles.card}>
              <h2>{item}:</h2>
              <textarea
                type="text"
                value={userData[item]}
                onChange={(e) => onChangeHandler(e, item)}
              />
            </div>
          ))}
        </div>
        <button className={styles.generateButton} onClick={onClickHandler}>
          Generate Invoice
        </button>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  );
}
