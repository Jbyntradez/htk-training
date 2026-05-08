import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/legal/LegalPageLayout";
import {
  HTK_LEGAL_CONTACT_EMAIL,
  HTK_LEGAL_LAST_UPDATED
} from "@/lib/legal-config";

export const metadata: Metadata = {
  title: "Privacy Policy | HTK Training",
  description:
    "Review the HTK Training Privacy Policy for details on information collection, applications, analytics, downloadable resources, and your privacy rights."
};

const sections = [
  {
    id: "scope",
    title: "Scope and Purpose",
    content: (
      <>
        <p>
          This Privacy Policy explains how Hard to Kill Training, including HTK Training
          and related coaching, consulting, resource, and booking offerings, collects,
          uses, stores, discloses, and protects information connected to this website and
          our services.
        </p>
        <p>
          It applies to website visitors, people who submit forms, request downloadable
          resources, book consultations, communicate with us by email or messaging, apply
          for coaching, purchase products, or otherwise interact with HTK Training online.
        </p>
        <p>
          This Privacy Policy is intended to provide a professional and transparent privacy
          framework. It is not a promise that every service, feature, or account system
          referenced below is active today; some disclosures are written to cover future
          offerings such as customer accounts, digital downloads, payments, and online
          coaching tools.
        </p>
      </>
    )
  },
  {
    id: "information-collected",
    title: "Information We Collect",
    content: (
      <>
        <p>Depending on how you use the site or our services, we may collect:</p>
        <BulletList
          items={[
            "Contact information such as your name, email address, phone number, social handle, and any details you provide when you contact us.",
            "Application and intake information such as your goals, training history, current fitness level, injuries, limitations, schedule, motivation, and other information you submit through coaching or booking forms.",
            "Booking and consultation information such as appointment preferences, calendar details, notes, and communications connected to a consultation request.",
            "Download and lead-generation information such as your name, email address, interests, and the resource you requested when you sign up to receive a PDF, checklist, guide, or other free material.",
            "Communications content such as emails, messages, inquiry submissions, and records of our responses.",
            "Transaction and account-related information if we offer payments, subscriptions, customer portals, or membership features in the future.",
            "Usage data such as pages viewed, referring URLs, device/browser information, approximate location data, session behavior, and similar technical information collected through cookies, analytics tools, logs, or platform infrastructure."
          ]}
        />
        <p>
          We may also receive information from third-party services you choose to use with
          us, such as booking platforms, payment processors, email service providers,
          analytics vendors, or form tools.
        </p>
      </>
    )
  },
  {
    id: "how-we-use-data",
    title: "How We Use Information",
    content: (
      <>
        <p>We may use collected information to:</p>
        <BulletList
          items={[
            "Operate, maintain, secure, and improve the website and our coaching, consulting, and digital resource offerings.",
            "Review coaching applications, respond to inquiries, schedule consultations, and communicate with you about requested services.",
            "Deliver downloadable resources, send resource follow-up emails, and manage lead-generation or email nurture sequences.",
            "Provide online coaching, training guidance, support materials, account access, or customer service if and when those features are offered.",
            "Process or document purchases, subscriptions, invoices, refunds, or payment issues if applicable.",
            "Measure traffic, improve performance, troubleshoot issues, detect abuse, and evaluate which content or offers are working.",
            "Comply with legal obligations, enforce our terms, protect rights and safety, and maintain business records."
          ]}
        />
        <p>
          We may use your information for marketing or promotional communications where
          permitted by law. You can opt out of marketing emails at any time using the
          unsubscribe link or by contacting us directly.
        </p>
      </>
    )
  },
  {
    id: "forms-bookings-downloads",
    title: "Applications, Booking Forms, and Downloadable Resources",
    content: (
      <>
        <p>
          If you submit a coaching application, consultation request, intake form, or
          similar fitness/performance questionnaire, you understand that the information you
          provide may include sensitive details about your body, goals, limitations,
          performance history, injuries, or schedule. You should only submit information you
          are comfortable sharing for coaching or business purposes.
        </p>
        <p>
          If you request a free resource, PDF, guide, checklist, or download, we may use
          the information you submit to deliver the resource, confirm your request, follow
          up about related HTK offers, and maintain a record of download activity. In some
          cases, downloading a resource may place you into an email sequence or newsletter
          flow until you opt out.
        </p>
        <p>
          If you book a consultation through a third-party calendar or booking provider,
          your submission is also subject to that provider’s terms, privacy practices, and
          platform controls. We are not responsible for privacy statements maintained by
          outside platforms.
        </p>
      </>
    )
  },
  {
    id: "cookies-analytics",
    title: "Cookies, Analytics, and Similar Technologies",
    content: (
      <>
        <p>
          We may use cookies, pixels, local browser storage, log files, analytics tools,
          and similar technologies to understand how visitors use the site, maintain site
          functionality, measure traffic, remember preferences, improve performance, and
          evaluate content or marketing effectiveness.
        </p>
        <p>
          Some cookies or tracking technologies may be provided by service providers acting
          on our behalf, such as hosting, analytics, booking, email, or form vendors. Your
          browser or device may allow you to limit cookies, delete stored data, or block
          certain tracking technologies, although parts of the site may not function
          properly if you do so.
        </p>
        <p>
          We may use analytics to understand which pages, downloads, offers, or traffic
          sources are performing. Analytics data is generally used in aggregated or
          business-operational ways, but it may still involve identifiers or device data.
        </p>
      </>
    )
  },
  {
    id: "sharing-third-parties",
    title: "Disclosure to Service Providers and Third Parties",
    content: (
      <>
        <p>We may disclose information to third parties when reasonably necessary to:</p>
        <BulletList
          items={[
            "Host, secure, maintain, or improve the website and related technical infrastructure.",
            "Operate forms, bookings, payment workflows, email communications, file delivery, customer support, or analytics.",
            "Comply with legal process, law enforcement requests, regulatory obligations, or good-faith safety concerns.",
            "Protect HTK Training, our users, or the public from fraud, abuse, security incidents, or rights violations.",
            "Support a reorganization, sale, merger, asset transfer, or similar business transaction involving all or part of the business."
          ]}
        />
        <p>
          We do not currently say that we “sell” personal information in the ordinary sense
          of handing customer data to data brokers for money. We also do not currently
          intend to share personal information for cross-context behavioral advertising.
          If those practices change in a way that creates opt-out rights under applicable
          privacy law, we will update this Privacy Policy and implement the required notices
          or controls.
        </p>
      </>
    )
  },
  {
    id: "california-rights",
    title: "California and Similar Privacy Rights",
    content: (
      <>
        <p>
          To the extent the California Consumer Privacy Act, as amended by the California
          Privacy Rights Act, or a similar state privacy law applies to our processing,
          eligible individuals may have rights that can include:
        </p>
        <BulletList
          items={[
            "The right to know what categories of personal information we collect, use, disclose, and retain.",
            "The right to request access to specific pieces of personal information, subject to legal exceptions.",
            "The right to request deletion of personal information, subject to legal exceptions.",
            "The right to request correction of inaccurate personal information where applicable.",
            "The right to opt out of the sale or sharing of personal information if those concepts apply to our practices.",
            "The right to non-discrimination for exercising applicable privacy rights."
          ]}
        />
        <p>
          We may need to verify your identity before responding to a privacy request. We may
          deny or limit a request where the law permits, including when we cannot verify the
          requester, need to preserve security, detect fraud, comply with law, complete a
          transaction, or maintain essential business records.
        </p>
        <p>
          To make a privacy request, contact{" "}
          <a
            href={`mailto:${HTK_LEGAL_CONTACT_EMAIL}`}
            className="font-semibold text-white underline decoration-red-500/45 underline-offset-4"
          >
            {HTK_LEGAL_CONTACT_EMAIL}
          </a>
          . If you are submitting a California-related request, include enough information
          for us to locate your records and verify your identity.
        </p>
      </>
    )
  },
  {
    id: "retention-security",
    title: "Retention, Security, and Limitations",
    content: (
      <>
        <p>
          We retain information for as long as reasonably necessary for the purposes
          described in this Privacy Policy, including to operate services, manage customer
          relationships, comply with law, resolve disputes, enforce agreements, maintain
          backups, and protect the security or integrity of our business.
        </p>
        <p>
          We use reasonable administrative, technical, and organizational measures intended
          to protect information against unauthorized access, misuse, loss, or disclosure.
          That said, no website, storage system, email transmission, or online service can
          be guaranteed to be completely secure. You use the site and submit information at
          your own risk.
        </p>
        <p>
          If you submit health, performance, or training-related details, you acknowledge
          that those disclosures are made voluntarily and that internet-based transmission
          carries inherent risk.
        </p>
      </>
    )
  },
  {
    id: "children-risk-contact",
    title: "Children, Fitness Content, and Contact",
    content: (
      <>
        <p>
          This site is not directed to children under 13, and HTK Training does not
          knowingly collect personal information from children under 13 without appropriate
          authorization. If you believe a child has submitted personal information to us,
          contact us and we will review the report and take appropriate action.
        </p>
        <p>
          HTK Training publishes fitness, training, mobility, conditioning, and performance
          content for general informational purposes. Training guidance, downloadable
          resources, videos, and coaching materials involve physical activity and therefore
          involve risk. Use all fitness content at your own risk, use proper judgment,
          follow safe technique, and seek appropriate medical clearance before starting any
          exercise or performance program.
        </p>
        <p>
          We may update this Privacy Policy from time to time. The “Last Updated” date above
          shows the effective date of the current version. If you have questions, privacy
          requests, or concerns, contact{" "}
          <a
            href={`mailto:${HTK_LEGAL_CONTACT_EMAIL}`}
            className="font-semibold text-white underline decoration-red-500/45 underline-offset-4"
          >
            {HTK_LEGAL_CONTACT_EMAIL}
          </a>
          .
        </p>
      </>
    )
  }
] as const;

export default function PrivacyPolicyPage() {
  return (
    <LegalPageLayout
      activePath="/privacy-policy"
      eyebrow="HTK privacy"
      title="Privacy Policy"
      intro="This policy explains what Hard to Kill Training collects, how we use it, how long we keep it, how downloadable resources and applications are handled, and what privacy rights may apply."
      summaryTitle="Privacy Policy"
      summaryBody="This policy covers the HTK website, forms, applications, booking flows, communications, downloadable resources, and future account or payment features where applicable."
      updatedLabel={HTK_LEGAL_LAST_UPDATED}
      contactEmail={HTK_LEGAL_CONTACT_EMAIL}
      sections={sections}
    />
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3 pl-5 marker:text-red-400 list-disc">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}
