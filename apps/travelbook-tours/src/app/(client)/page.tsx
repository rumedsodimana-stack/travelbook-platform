import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import {
  ArrowRight,
  BadgeCheck,
  Clock3,
  Headphones,
  MapPin,
  ShieldCheck,
  Sparkles,
  Star,
} from "lucide-react";
import { ClientLookupForm } from "./ClientLookupForm";
import { CraftJourneyPromoCard } from "./CraftJourneyPromoCard";
import { ThingsToDoSlideshow } from "./ThingsToDoSlideshow";
import {
  clientPortalStats,
  destinationHighlights,
  getClientPackageVisual,
  homeHeroScene,
} from "./client-visuals";
import { getAppSettings, getDisplayCompanyName } from "@/lib/app-config";
import { getPackagesForClient } from "@/lib/db";
import { getFromPrice } from "@/lib/package-price";

const SERVICE_PILLARS = [
  {
    icon: Headphones,
    title: "Local planning support",
    text: "Real itinerary help before and after booking, not just a checkout page.",
  },
  {
    icon: ShieldCheck,
    title: "Flexible booking path",
    text: "Compare package styles, keep your booking visible, and adjust the plan with context.",
  },
  {
    icon: BadgeCheck,
    title: "Curated Sri Lanka routing",
    text: "Trips shaped around transfer times, scenic legs, and how the island actually moves.",
  },
];

export default async function ClientPortalPage() {
  const settings = await getAppSettings();
  const allPackages = await getPackagesForClient();
  const featuredPackages = allPackages.filter((pkg) => pkg.featured).slice(0, 6);
  const featuredStories = destinationHighlights.slice(0, 3);
  const brandName = getDisplayCompanyName(settings);

  return (
    <div className="space-y-16 pb-16">
      <section className="relative overflow-hidden rounded-[2rem] border border-white/20 bg-[#07161d] text-[#f7ead7] shadow-[0_28px_70px_-34px_rgba(7,22,29,0.95)]">
        <div className="absolute inset-0">
          <Image
            src={homeHeroScene.imageUrl}
            alt="Sri Lanka travel panorama"
            fill
            unoptimized
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(11,33,38,0.92)_8%,rgba(11,33,38,0.68)_46%,rgba(11,33,38,0.24)_100%)]" />
        </div>

        <div className="relative grid gap-10 px-6 py-10 sm:px-8 sm:py-12 lg:grid-cols-[1.18fr_0.82fr] lg:px-12 lg:py-14">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.28em] text-amber-300 backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5" />
              Curated island journeys
            </div>
            <h1 className="mt-6 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
              {homeHeroScene.title}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-[#e5dccd] sm:text-lg">
              {homeHeroScene.summary}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/journey-builder"
                className="inline-flex items-center gap-2 rounded-full bg-[#f2dfbf] px-6 py-3 text-sm font-semibold text-[#07161d] shadow-[0_16px_38px_-22px_rgba(239,214,174,0.95)] transition hover:bg-[#f7e8cf]"
              >
                {settings.portal.journeyBuilderLabel}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/packages"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/15"
              >
                {settings.portal.packagesLabel}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/my-bookings"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/15"
              >
                {settings.portal.myBookingsLabel}
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              {homeHeroScene.chips.map((chip) => (
                <span
                  key={chip}
                  className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-sm text-[#efe3d0] backdrop-blur-sm"
                >
                  {chip}
                </span>
              ))}
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {clientPortalStats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-[1.5rem] border border-white/10 bg-white/10 px-4 py-4 backdrop-blur-sm"
                >
                  <p className="text-sm text-[#d9ccb8]">{stat.label}</p>
                  <p className="mt-2 text-lg font-semibold text-white">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4">
            <div className="rounded-[1.75rem] border border-white/12 bg-white/10 p-5 backdrop-blur-md">
              <p className="text-xs uppercase tracking-[0.3em] text-amber-400">
                Route Notes
              </p>
              <h2 className="mt-3 text-2xl font-semibold text-white">
                Designed around transfer flow, not just map pins
              </h2>
              <p className="mt-3 text-sm leading-6 text-[#dfd7c6]">
                Start in Colombo, move cleanly through heritage sites or tea
                country, then finish on the coast without doubling back.
              </p>
              <Link
                href="/journey-builder"
                className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/15"
              >
                Open the live route builder
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              {featuredStories.map((story) => (
                <Link
                  key={story.title}
                  href={story.href}
                  className="group overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/5 text-white shadow-[0_16px_40px_-28px_rgba(20,184,166,0.2)] backdrop-blur-sm transition hover:-translate-y-0.5"
                >
                  <div className="grid gap-3 p-3 sm:grid-cols-[112px_1fr] lg:grid-cols-[96px_1fr]">
                    <div className="relative h-28 overflow-hidden rounded-[1.1rem] sm:h-full">
                      <Image
                        src={story.imageUrl}
                        alt={story.title}
                        fill
                        unoptimized
                        className="object-cover transition duration-500 group-hover:scale-105"
                        sizes="100vw"
                      />
                    </div>
                    <div className="flex flex-col justify-between gap-3 p-1">
                      <div>
                        <p className="text-xs uppercase tracking-[0.28em] text-amber-400">
                          {story.location}
                        </p>
                        <h3 className="mt-2 text-lg font-semibold tracking-tight text-white">
                          {story.title}
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-white/60">
                          {story.summary}
                        </p>
                      </div>
                      <span className="inline-flex items-center gap-2 text-sm font-semibold text-teal-400">
                        See routes
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {SERVICE_PILLARS.map(({ icon: Icon, title, text }) => (
          <div
            key={title}
            className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 shadow-[0_18px_44px_-32px_rgba(20,184,166,0.15)] backdrop-blur-xl"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-500/20 border border-teal-400/20 text-teal-300">
              <Icon className="h-5 w-5" />
            </div>
            <h2 className="mt-4 text-lg font-semibold text-white">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-white/60">{text}</p>
          </div>
        ))}
      </section>

      {featuredPackages.length > 0 && (
        <section className="space-y-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-amber-400">
                Featured Journeys
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-white">
                Popular ways to see the island
              </h2>
            </div>
            <Link
              href="/packages"
              className="inline-flex items-center gap-2 text-sm font-semibold text-teal-400"
            >
              View every package
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <CraftJourneyPromoCard
              label={settings.portal.journeyBuilderLabel}
              className="lg:col-span-2"
            />
            {featuredPackages.slice(0, 4).map((pkg, index) => {
              const visual = getClientPackageVisual(pkg);

              return (
                <Link
                  key={pkg.id}
                  href={`/packages/${pkg.id}`}
                  className={`group relative overflow-hidden rounded-[2rem] border border-white/25 bg-[#07161d] text-[#f7ead7] shadow-[0_24px_60px_-34px_rgba(7,22,29,0.95)] ${
                    index === 0 ? "lg:col-span-2" : ""
                  }`}
                >
                  <div className="absolute inset-0">
                    <Image
                      src={visual.imageUrl}
                      alt={pkg.name}
                      fill
                      unoptimized
                      className="object-cover transition duration-700 group-hover:scale-105"
                      sizes="100vw"
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(11,33,38,0.92)_6%,rgba(11,33,38,0.66)_46%,rgba(11,33,38,0.24)_100%)]" />
                  </div>

                  <div className="relative flex min-h-[22rem] flex-col justify-between p-6 sm:p-8">
                    <div className="max-w-2xl">
                      <p className="text-xs uppercase tracking-[0.28em] text-amber-400">
                        {visual.eyebrow}
                      </p>
                      <h3 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
                        {pkg.name}
                      </h3>
                      <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-[#ece1cf]">
                        <span className="inline-flex items-center gap-1.5">
                          <MapPin className="h-4 w-4" />
                          {pkg.region ?? pkg.destination}
                        </span>
                        <span>{pkg.duration}</span>
                        {(pkg.rating ?? 0) > 0 && (
                          <span className="inline-flex items-center gap-1.5 text-amber-300">
                            <Star className="h-4 w-4 fill-current" />
                            {pkg.rating?.toFixed(1)}
                          </span>
                        )}
                      </div>
                      <p className="mt-4 max-w-xl text-sm leading-6 text-[#e1d8ca]">
                        {visual.highlight}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-end justify-between gap-4">
                      <div className="flex flex-wrap gap-2">
                        {visual.chips.map((chip) => (
                          <span
                            key={chip}
                            className="rounded-full border border-white/14 bg-white/10 px-3 py-1.5 text-xs uppercase tracking-[0.18em] text-[#efe3d0]"
                          >
                            {chip}
                          </span>
                        ))}
                      </div>
                      <div className="rounded-[1.4rem] bg-teal-500/20 border border-teal-400/20 px-4 py-3 text-right text-white backdrop-blur-sm">
                        <p className="text-xs uppercase tracking-[0.24em] text-teal-300">
                          From
                        </p>
                        <p className="mt-1 text-xl font-semibold">
                          {getFromPrice(pkg).toLocaleString()} {pkg.currency}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      <ThingsToDoSlideshow />

      <section
        id="track-booking"
        className="grid gap-6 scroll-mt-28 lg:grid-cols-[0.92fr_1.08fr]"
      >
        <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 shadow-[0_20px_48px_-34px_rgba(20,184,166,0.15)] backdrop-blur-xl">
          <div className="p-6 sm:p-8">
            <p className="text-xs uppercase tracking-[0.28em] text-amber-400">
              Booking Visibility
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white">
              Track your booking with {brandName}
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-white/60">
              Use your reference or email to reopen your request, check dates,
              and follow the package details after your first enquiry.
            </p>
          </div>
          <div className="border-t border-white/10 bg-white/5 p-6 sm:p-8">
            <Suspense
              fallback={
                <div className="h-48 animate-pulse rounded-[1.5rem] bg-white/70" />
              }
            >
              <ClientLookupForm />
            </Suspense>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {destinationHighlights.slice(3, 6).map((scene) => (
            <Link
              key={scene.title}
              href={scene.href}
              className="group overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/5 shadow-[0_18px_44px_-32px_rgba(20,184,166,0.15)] backdrop-blur-xl"
            >
              <div className="relative aspect-[5/4] overflow-hidden">
                <Image
                  src={scene.imageUrl}
                  alt={scene.title}
                  fill
                  unoptimized
                  className="object-cover transition duration-500 group-hover:scale-105"
                  sizes="100vw"
                />
              </div>
              <div className="p-5">
                <p className="text-xs uppercase tracking-[0.26em] text-amber-400">
                  {scene.location}
                </p>
                <h3 className="mt-2 text-xl font-semibold tracking-tight text-white">
                  {scene.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-white/60">
                  {scene.summary}
                </p>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-teal-400">
                  Explore this region
                  <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="rounded-[2rem] border border-white/10 bg-white/5 px-6 py-6 shadow-[0_18px_42px_-32px_rgba(20,184,166,0.15)] backdrop-blur-xl sm:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-amber-400">
              Planning Rhythm
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">
              Reserve the route first, tune the details after
            </h2>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-teal-500 px-4 py-2 text-sm font-semibold text-[#07161d]">
            <Clock3 className="h-4 w-4" />
            Flexible follow-up after enquiry
          </div>
        </div>
      </section>
    </div>
  );
}
