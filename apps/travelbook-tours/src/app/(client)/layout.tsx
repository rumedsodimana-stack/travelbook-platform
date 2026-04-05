import Link from "next/link";
import Image from "next/image";
import { Compass, Mail, Phone, Waves, Mountain, Landmark } from "lucide-react";
import { ClientHeader } from "./ClientHeader";
import { getAppSettings, getDisplayCompanyName } from "@/lib/app-config";

export default async function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getAppSettings();
  const brandName = getDisplayCompanyName(settings);

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#07161d] text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0"
        style={{
          background:
            "radial-gradient(circle at 12% 12%, rgba(20,184,166,0.18), transparent 28%), radial-gradient(circle at 88% 8%, rgba(251,191,36,0.10), transparent 24%), radial-gradient(circle at 80% 70%, rgba(13,148,132,0.14), transparent 30%), linear-gradient(180deg, #07161d 0%, #0a1d26 100%)",
        }}
      />
      <ClientHeader
        brandName={brandName}
        logoUrl={settings.company.logoUrl}
        topBannerText={settings.portal.topBannerText}
        topBannerSubtext={settings.portal.topBannerSubtext}
        locationBadgeText={settings.portal.locationBadgeText}
        mobileMenuDescription={settings.portal.mobileMenuDescription}
        packagesLabel={settings.portal.packagesLabel}
        journeyBuilderLabel={settings.portal.journeyBuilderLabel}
        myBookingsLabel={settings.portal.myBookingsLabel}
        trackBookingLabel={settings.portal.trackBookingLabel}
      />
      <main className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
        {children}
      </main>
      <footer className="relative mt-auto border-t border-white/10 bg-[#07161d]/95 shadow-[0_-10px_40px_-30px_rgba(20,184,166,0.15)] backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <div className="mb-8 grid gap-4 rounded-[2rem] border border-teal-500/20 bg-white/5 p-6 text-white shadow-[0_24px_60px_-28px_rgba(20,184,166,0.2)] backdrop-blur-xl lg:grid-cols-[1.2fr_0.8fr] lg:p-8">
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-amber-400">
                {settings.portal.footerCtaEyebrow}
              </p>
              <h3 className="mt-3 text-2xl font-semibold tracking-tight">
                {settings.portal.footerCtaTitle}
              </h3>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/60">
                {settings.portal.footerCtaDescription}
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              <div className="rounded-3xl border border-white/10 bg-white/8 px-4 py-4">
                <Mountain className="h-5 w-5 text-amber-400" />
                <p className="mt-3 text-sm font-medium">Hill-country trains</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/8 px-4 py-4">
                <Waves className="h-5 w-5 text-amber-400" />
                <p className="mt-3 text-sm font-medium">South and east coast stays</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/8 px-4 py-4">
                <Landmark className="h-5 w-5 text-amber-400" />
                <p className="mt-3 text-sm font-medium">Cultural triangle routes</p>
              </div>
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-teal-500/20 border border-teal-400/20 text-teal-300">
                  {settings.company.logoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <Image
                      src={settings.company.logoUrl}
                      alt={brandName}
                      fill
                      unoptimized
                      className="rounded-2xl object-cover"
                      sizes="100vw"
                    />
                  ) : (
                    <Compass className="h-4 w-4" />
                  )}
                </div>
                <span className="font-semibold text-white">
                  {brandName}
                </span>
              </div>
              <p className="mt-3 text-sm leading-6 text-white/50">
                {settings.portal.clientPortalDescription}
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white">
                {settings.portal.footerExploreTitle}
              </h4>
              <ul className="mt-3 space-y-2">
                <li>
                  <Link
                    href="/packages"
                    className="text-sm text-white/50 transition hover:text-teal-300"
                  >
                    {settings.portal.packagesLabel}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/journey-builder"
                    className="text-sm text-white/50 transition hover:text-teal-300"
                  >
                    {settings.portal.journeyBuilderLabel}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/my-bookings"
                    className="text-sm text-white/50 transition hover:text-teal-300"
                  >
                    {settings.portal.myBookingsLabel}
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white">
                {settings.portal.footerContactTitle}
              </h4>
              <ul className="mt-3 space-y-2 text-sm text-white/50">
                {settings.company.email ? (
                  <li className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-amber-400" />
                    {settings.company.email}
                  </li>
                ) : null}
                {settings.company.phone ? (
                  <li className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-amber-400" />
                    {settings.company.phone}
                  </li>
                ) : null}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white">
                {settings.portal.footerBaseTitle}
              </h4>
              <p className="mt-3 text-sm leading-6 text-white/50">
                {settings.company.address}
                {settings.portal.footerBaseDescription ? (
                  <>
                    <br />
                    {settings.portal.footerBaseDescription}
                  </>
                ) : null}
              </p>
            </div>
          </div>

          <div className="mt-10 border-t border-white/10 pt-8 text-center text-sm text-white/30">
            © {new Date().getFullYear()} {brandName}
            {settings.portal.copyrightSuffix
              ? ` · ${settings.portal.copyrightSuffix}`
              : ""}
          </div>
        </div>
      </footer>
    </div>
  );
}
