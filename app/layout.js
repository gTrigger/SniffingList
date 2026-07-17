import "@/styles.css";
import localFont from 'next/font/local';
import Header from "@/components/Header/Header.js"
import Footer from "@/components/Footer/Footer.js"
import Toast from "@/components/common/Toast/Toast.js";
import AppLoader from "@/components/AppLoader/AppLoader.js";

const primaryFont = localFont({
    src: './fonts/Montserrat.ttf',
    variable: '--primary-font',
    display: 'swap',
});

const accentFont = localFont({
    src: './fonts/RhythmicSVG.otf',
    variable: '--accent-font',
    display: 'block',
});

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={`${primaryFont.variable} ${accentFont.variable}`}>
            <AppLoader>
                <Header />
                <main>
                    {children}
                </main>
                <Footer />
                <Toast />
                <div id="toastPortal" />
            </AppLoader>
            </body>
        </html>
    );
}
