import "@/styles.scss";
import localFont from 'next/font/local';
import Header from "@/components/Header/Header"
import Footer from "@/components/Footer/Footer"
import Toast from "@/components/common/Toast/Toast";
import AppLoader from "@/components/AppLoader/AppLoader";

const montserratFont = localFont({
    src: './fonts/Montserrat.ttf',
    variable: '--montserrat-font',
    display: 'swap',
});

const rhythmicFont = localFont({
    src: './fonts/RhythmicSVG.otf',
    variable: '--rhythmic-font',
    display: 'block',
});

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={`${montserratFont.variable} ${rhythmicFont.variable}`}>
            <AppLoader>
                <Header />
                <main>
                    {children}
                </main>
                <Footer />
                <Toast />
            </AppLoader>
            </body>
        </html>
    );
}
