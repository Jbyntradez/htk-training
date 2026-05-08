import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/legal/LegalPageLayout";
import {
  HTK_GOVERNING_LAW_PLACEHOLDER,
  HTK_LEGAL_CONTACT_EMAIL,
  HTK_LEGAL_LAST_UPDATED
} from "@/lib/legal-config";

export const metadata: Metadata = {
  title: "Terms of Service | HTK Training",
  description:
    "Review the HTK Training Terms of Service, including coaching disclaimers, liability language, payment terms, digital resource limitations, and user responsibilities."
};

const sections = [
  {
    id: "acceptance",
    title: "Acceptance of Terms",
    content: (
      <>
        <p>
          These Terms of Service govern your use of the Hard to Kill Training website and
          any related services, content, coaching, consulting, downloads, communications,
          and digital products offered by HTK Training.
        </p>
        <p>
          By accessing the site, submitting a form, booking a consultation, downloading a
          resource, purchasing a product, creating an account if offered in the future, or
          using any HTK Training service, you agree to these Terms. If you do not agree, do
          not use the site or services.
        </p>
        <p>
          HTK Training may update these Terms from time to time. Continued use after an
          update means you accept the revised Terms.
        </p>
      </>
    )
  },
  {
    id: "services-eligibility",
    title: "Services, Eligibility, and Future Accounts",
    content: (
      <>
        <p>
          HTK Training may offer fitness coaching, performance consulting, training
          programs, online coaching, consultations, downloadable resources, PDFs, email
          communications, and related products or services. Some services may be limited,
          changed, paused, or discontinued at any time.
        </p>
        <p>
          You may use the site and services only if you can form a binding agreement under
          applicable law. If you are under the legal age of majority where you live, you
          should use HTK services only with the involvement of a parent or legal guardian.
        </p>
        <p>
          If HTK later offers customer accounts, memberships, subscriptions, or client
          portals, you will be responsible for maintaining the confidentiality of your login
          credentials, for all activity under your account, and for promptly notifying HTK
          of any unauthorized access.
        </p>
      </>
    )
  },
  {
    id: "medical-disclaimer",
    title: "Fitness, Coaching, and Medical Disclaimer",
    content: (
      <>
        <p>
          HTK Training provides fitness, performance, training, conditioning, mobility, and
          coaching information for educational and general informational purposes only. HTK
          Training is not providing medical care, physical therapy, chiropractic care,
          mental health treatment, diagnosis, or emergency services through this website or
          ordinary coaching communications.
        </p>
        <p>
          Nothing on the site, in a PDF, in a program, in a consultation, or in coaching
          communications should be treated as medical advice or as a substitute for care
          from a qualified physician or other licensed healthcare professional.
        </p>
        <p>
          You are responsible for obtaining medical clearance before beginning or modifying
          an exercise, conditioning, or performance program, especially if you are injured,
          pregnant, postpartum, returning from illness, taking medication, experiencing
          symptoms, or living with any diagnosed or suspected health condition.
        </p>
      </>
    )
  },
  {
    id: "assumption-risk",
    title: "Assumption of Risk and Waiver of Liability",
    content: (
      <>
        <p>
          Physical training and athletic activity involve inherent risks. These risks can
          include, without limitation, soreness, strains, sprains, falls, improper exercise
          execution, equipment misuse, aggravation of a pre-existing condition, overtraining,
          dehydration, dizziness, cardiac events, serious injury, permanent disability, or
          death.
        </p>
        <p>
          By using the site or participating in any HTK content or service, you knowingly
          and voluntarily assume all risks associated with exercise, training, recovery,
          sport performance, and physical participation. You agree that you are solely
          responsible for how you interpret, apply, and perform any training guidance or
          program.
        </p>
        <p>
          To the fullest extent permitted by law, you release, waive, and agree not to hold
          liable HTK Training and its owners, coaches, contractors, employees, affiliates,
          or representatives for claims, injuries, losses, damages, or expenses arising out
          of or related to your use of the site, downloads, programs, consultations, or
          coaching services, except to the extent liability cannot be waived under applicable
          law.
        </p>
      </>
    )
  },
  {
    id: "user-responsibilities",
    title: "Your Responsibilities",
    content: (
      <>
        <p>When using HTK Training, you agree that you will:</p>
        <BulletList
          items={[
            "Provide accurate, current, and complete information in forms, applications, bookings, and account records.",
            "Use sound judgment and stop training immediately if you experience pain, dizziness, faintness, chest pain, breathing difficulty, or other concerning symptoms.",
            "Use proper technique, safe equipment, and an appropriate training environment.",
            "Take responsibility for seeking professional medical or emergency care when needed.",
            "Follow all applicable laws and not use the site or services for fraudulent, abusive, or harmful purposes."
          ]}
        />
      </>
    )
  },
  {
    id: "coaching-expectations",
    title: "Consultation, Coaching, and Results Expectations",
    content: (
      <>
        <p>
          HTK Training may provide recommendations, programming, accountability, strategy,
          and education, but you remain responsible for your execution, recovery, lifestyle,
          honesty, effort, and compliance.
        </p>
        <p>
          Results are not guaranteed. Performance outcomes depend on many factors outside
          HTK’s control, including health status, consistency, sleep, stress, nutrition,
          effort, technique, history, equipment, adherence, and life circumstances.
        </p>
        <p>
          HTK reserves the right to decline or discontinue a consultation, application, or
          coaching relationship if the fit is poor, expectations are unrealistic, safety is
          a concern, communication is abusive, required information is withheld, or the
          relationship is otherwise not workable.
        </p>
      </>
    )
  },
  {
    id: "downloads-ip",
    title: "Digital Products, Downloads, and Intellectual Property",
    content: (
      <>
        <p>
          All website content, training materials, PDFs, checklists, videos, text, design
          elements, graphics, branding, and downloadable resources are owned by or licensed
          to HTK Training and are protected by intellectual property laws.
        </p>
        <p>
          Unless HTK gives written permission otherwise, you receive a limited,
          non-exclusive, non-transferable, revocable license to use purchased or free
          digital materials for your own personal, non-commercial use only.
        </p>
        <BulletList
          items={[
            "You may not reproduce, republish, sell, sublicense, distribute, upload, post publicly, or share HTK materials as your own.",
            "You may not use HTK content to build or market a competing program, library, coaching system, prompt pack, or digital product.",
            "You may not remove branding, copyright notices, or proprietary markings from materials."
          ]}
        />
      </>
    )
  },
  {
    id: "payments-refunds",
    title: "Payments, Billing, and Refunds",
    content: (
      <>
        <p>
          Prices, billing schedules, and purchase terms for coaching, consultations,
          downloads, subscriptions, or other paid services will be disclosed on the
          applicable sales, checkout, invoice, or proposal page.
        </p>
        <p>
          Unless a different refund policy is clearly stated in writing for a specific
          offer, coaching fees, consultation fees, digital product purchases, and download
          purchases are generally treated as non-refundable once delivered, scheduled, or
          made accessible, except where applicable law requires otherwise.
        </p>
        <p>
          If future subscription or membership offerings are added, you authorize HTK or
          its payment processor to charge the payment method you provide in accordance with
          the pricing and renewal terms presented at checkout.
        </p>
      </>
    )
  },
  {
    id: "prohibited-use",
    title: "Prohibited Use, Suspension, and Termination",
    content: (
      <>
        <p>You may not use the site or services to:</p>
        <BulletList
          items={[
            "Violate laws, infringe rights, or submit false or misleading information.",
            "Interfere with site functionality, security, or access controls.",
            "Copy, scrape, reverse engineer, automate access to, or commercially exploit protected HTK content without authorization.",
            "Harass, threaten, abuse, or impersonate HTK personnel or other users.",
            "Share private coaching materials, portal access, or paid downloads outside the scope of your license."
          ]}
        />
        <p>
          HTK may suspend, restrict, or terminate your access or service relationship at
          any time, with or without notice, if it reasonably believes you violated these
          Terms, created safety risk, misused materials, disrupted operations, or exposed
          HTK to legal or business harm.
        </p>
      </>
    )
  },
  {
    id: "warranties-liability",
    title: "Disclaimer of Warranties and Limitation of Liability",
    content: (
      <>
        <p>
          The site and services are provided on an “as is” and “as available” basis to the
          fullest extent permitted by law. HTK Training disclaims warranties of any kind,
          whether express or implied, including implied warranties of merchantability,
          fitness for a particular purpose, accuracy, availability, and non-infringement.
        </p>
        <p>
          To the fullest extent permitted by law, HTK Training will not be liable for any
          indirect, incidental, consequential, special, exemplary, or punitive damages, or
          for lost profits, lost revenue, lost opportunities, business interruption, data
          loss, or personal injury arising from or relating to the site, services, or your
          participation in training activities.
        </p>
        <p>
          To the fullest extent permitted by law, HTK’s total liability for any claim
          arising from the site or services will not exceed the amount you paid to HTK
          Training for the specific service giving rise to the claim during the twelve months
          before the event giving rise to liability.
        </p>
      </>
    )
  },
  {
    id: "indemnification",
    title: "Indemnification",
    content: (
      <>
        <p>
          You agree to defend, indemnify, and hold harmless HTK Training and its owners,
          affiliates, contractors, employees, and representatives from and against claims,
          liabilities, damages, judgments, losses, costs, and expenses, including reasonable
          legal fees, arising out of or related to your use of the site or services, your
          training participation, your violation of these Terms, your infringement of any
          rights, or your misuse of HTK content or systems.
        </p>
      </>
    )
  },
  {
    id: "governing-law",
    title: "Governing Law and Contact",
    content: (
      <>
        <p>
          These Terms are governed by and construed in accordance with the laws of{" "}
          <span className="font-semibold text-white">{HTK_GOVERNING_LAW_PLACEHOLDER}</span>,
          without regard to its conflict-of-law rules, unless another governing law is
          required by applicable law or stated in a written customer agreement.
        </p>
        <p>
          If any provision of these Terms is held unenforceable, the remaining provisions
          will remain in full force to the extent permitted by law.
        </p>
        <p>
          Questions about these Terms, liability notices, intellectual property permissions,
          or legal requests should be sent to{" "}
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

export default function TermsOfServicePage() {
  return (
    <LegalPageLayout
      activePath="/terms-of-service"
      eyebrow="HTK terms"
      title="Terms of Service"
      intro="These Terms govern how you use the HTK Training website, training content, consultations, coaching services, digital downloads, future accounts, and related offerings."
      summaryTitle="Terms of Service"
      summaryBody="HTK Training provides physically demanding performance content and services. Read these Terms carefully before booking, downloading, purchasing, training, or participating."
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
