import React from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";

interface TitleProps {
    title?: string;
    description?: string;
    useDesktopWidth?: boolean;
}

const Title: React.FC<TitleProps> = ({ title = "", description = "", useDesktopWidth = false }) => {
    const ogTitle = `${title} | Serch Admin`;
    const logo = "https://wyvcjsumdfoamsmdzsna.supabase.co/storage/v1/object/public/serch/logo/black/squared.png"

    return (
        <HelmetProvider>
            <Helmet>
                <title>{ogTitle}</title>
                <meta name="description" content={description || "Managing company data with respect and duty"} />
                <meta name="author" content="Serch Team" />
                <link rel="author" href="https://www.serchservice.com/leadership" />
                <meta name="keywords" content="Serch" />
                <meta name="creator" content="Team Serch" />
                <meta name="robots" content="index, follow" />
                {useDesktopWidth && (<meta name="viewport" content="width=1024" />)}
                <link rel="canonical" href="https://www.serchservice.com" />
                <meta name="classification" content="RequestSharing and ProvideSharing" />
                <meta name="category" content="RequestSharing and ProvideSharing" />
                <link rel="assets" href="https://www.serchservice.com/media-and-assets" />
                <link rel="icon" href="/favicon.png" type="icon/png" sizes="32x32" />
                <link rel="apple-touch-icon" href="/favicon.png" type="icon/png" sizes="32x32" />

                {/* <meta property="al:ios:app_store_id" content="123456789" />
            <meta property="al:ios:url" content="https://example.com" />
            <meta property="al:android:package" content="com.example" />
            <meta property="al:android:url" content="https://example.com" /> */}

                {/* Open Graph */}
                <meta property="og:title" content={ogTitle} />
                <meta property="og:description" content={description} />
                <meta property="og:image" content={logo} />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://www.serchservice.com" />
                <meta property="og:site_name" content="Serch" />

                {/* Twitter */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:site" content="@serchservice" />
                <meta name="twitter:creator" content="@serchservice" />
                <meta name="twitter:title" content="Serchservice | Service made easy" />
                <meta name="twitter:description" content="Making it easy to access service providers at all times" />
                <meta name="twitter:image" content={logo} />
            </Helmet>
        </HelmetProvider>
    );
};

export default Title;