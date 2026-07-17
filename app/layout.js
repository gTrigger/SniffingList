import "./styles.css";
import Header from "./components/Header/Header.js"
import Footer from "./components/Footer/Footer.js"
import Toast from "./components/common/Toast/Toast.js";

export default function RootLayout({ children }) {
    return (
        <html>
            <body>
                <Header />
                <main>
                    {children}
                </main>
                <Footer />
                <Toast />
                <div id="toast-portal" />
            </body>
        </html>
    );
}
