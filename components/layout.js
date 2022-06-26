import Logo from '../components/logo';

import Head from 'next/head';

import styles from './css-modules/layout.module.css'

export default function Layout({ children }) {
    return (
        <div>

            <Head>
                <title>Plainer</title>

                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0-beta1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-0evHe/X+R7YkIZDRvuzKMRqM+OrBnVFBL6DOitfPri4tjfHxaWutUpFmBp4vmVor" crossOrigin="anonymous"></link>
                <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0-beta1/dist/js/bootstrap.bundle.min.js" integrity="sha384-pprn3073KE6tl6bjs2QrFaJGz5/SUsLqktiwsUTF55Jfv3qYSDhgCecCxMW52nD2" crossOrigin="anonymous"></script>
            </Head>

            <div className={styles.content}>
                <Logo />
                <div>{children}</div>
            </div>
        </div>
        
    )
}