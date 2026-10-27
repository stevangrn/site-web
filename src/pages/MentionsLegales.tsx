import { useEffect } from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import { toTelHref } from '../lib/phone';
import type { Profile } from '../lib/supabase';

interface MentionsLegalesProps {
  profile: Profile | null;
}

// Page obligatoire pour un site professionnel en France (article 6-III de la
// loi n°2004-575 du 21 juin 2004 pour la confiance dans l'économie numérique,
// dite "LCEN"). Les informations ci-dessous reflètent la situation réelle du
// site : édité par un particulier, sans structure juridique immatriculée à
// ce jour (donc pas de numéro SIRET, RCS ou de TVA intracommunautaire).
//
// Si un statut juridique est créé plus tard (auto-entreprise, société...),
// il faudra compléter la section "Éditeur du site" avec le numéro SIRET,
// la forme juridique, et le cas échéant le capital social et le numéro de
// TVA intracommunautaire.
export function MentionsLegales({ profile }: MentionsLegalesProps) {
  const name = profile?.name || 'Stevan Garon';
  const email = profile?.email || 'stevan.garon@gmail.com';
  const phone = profile?.phone || '06 27 24 56 73';
  const location = profile?.location || 'La Chaize-le-Vicomte, Vendée, France';

  // Arrivée par le lien "Politique de confidentialité" (adresse se terminant
  // par #confidentialite) : on fait défiler jusqu'à cette section.
  useEffect(() => {
    if (window.location.hash === '#confidentialite') {
      document.getElementById('confidentialite')?.scrollIntoView();
    }
  }, []);

  return (
    <>
      {/* Header */}
      <section className="pt-20 pb-12 px-6 bg-[var(--bg-primary)]">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-amber-500 text-sm tracking-[0.3em] uppercase mb-4">
            Informations légales
          </p>
          <h1 className="text-4xl md:text-5xl font-light mb-4 text-[var(--text-primary)]">
            Mentions Légales
          </h1>
          <p className="text-[var(--text-secondary)] max-w-2xl mx-auto">
            Conformément à la loi n°2004-575 du 21 juin 2004 pour la confiance
            dans l'économie numérique.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 px-6 bg-[var(--bg-primary)]">
        <div className="max-w-3xl mx-auto space-y-12 text-[var(--text-secondary)] leading-relaxed">
          {/* Éditeur du site */}
          <div>
            <h2 className="text-2xl font-light text-[var(--text-primary)] mb-4">
              Éditeur du site
            </h2>
            <p>
              Le site <span className="text-[var(--text-primary)]">stevangaron.fr</span> est
              édité à titre individuel par :
            </p>
            <div className="mt-4 space-y-3 bg-[var(--surface)] rounded-xl p-6 border border-[var(--border-color)]">
              <p className="text-[var(--text-primary)]">{name}</p>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0" />
                <span>{location}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-amber-500 shrink-0" />
                <a href={`mailto:${email}`} className="hover:text-amber-500 transition-colors">
                  {email}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-amber-500 shrink-0" />
                <a href={toTelHref(phone)} className="hover:text-amber-500 transition-colors">
                  {phone}
                </a>
              </div>
            </div>
            <p className="mt-4 text-sm text-[var(--text-muted)]">
              Cette activité de photographie est exercée à titre individuel et n'est, à ce
              jour, rattachée à aucune structure juridique immatriculée (pas de numéro SIRET,
              de numéro RCS, ni de numéro de TVA intracommunautaire).
            </p>
          </div>

          {/* Directeur de la publication */}
          <div>
            <h2 className="text-2xl font-light text-[var(--text-primary)] mb-4">
              Directeur de la publication
            </h2>
            <p>{name}, également éditeur du site (coordonnées ci-dessus).</p>
          </div>

          {/* Hébergement */}
          <div>
            <h2 className="text-2xl font-light text-[var(--text-primary)] mb-4">Hébergement</h2>
            <p>Le site est hébergé par :</p>
            <div className="mt-4 space-y-1 bg-[var(--surface)] rounded-xl p-6 border border-[var(--border-color)]">
              <p className="text-[var(--text-primary)]">GitHub, Inc.</p>
              <p>88 Colin P Kelly Jr Street</p>
              <p>San Francisco, CA 94107</p>
              <p>États-Unis</p>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-2 text-amber-500 hover:text-amber-400 transition-colors"
              >
                github.com
              </a>
            </div>
          </div>

          {/* Propriété intellectuelle */}
          <div>
            <h2 className="text-2xl font-light text-[var(--text-primary)] mb-4">
              Propriété intellectuelle
            </h2>
            <p>
              L'ensemble des photographies, textes, logos et éléments graphiques présents sur
              ce site sont la propriété exclusive de {name}, sauf mention contraire. Toute
              reproduction, représentation, modification ou diffusion, totale ou partielle, de
              ce site ou de son contenu, par quelque procédé que ce soit, est interdite sans
              autorisation écrite préalable.
            </p>
          </div>

          {/* Politique de confidentialité — id utilisé par les liens
              "Politique de confidentialité" (scroll-mt : laisse la place de
              la barre de navigation fixe en haut de l'écran). */}
          <div id="confidentialite" className="scroll-mt-24">
            <h2 className="text-2xl font-light text-[var(--text-primary)] mb-4">
              Politique de confidentialité
            </h2>
            <p>
              Cette politique décrit les informations personnelles collectées sur le site
              <span className="text-[var(--text-primary)]"> stevangaron.fr</span> et la manière
              dont elles sont utilisées.
            </p>
            <div className="mt-4 space-y-3 text-sm">
              <p>
                <span className="font-medium text-[var(--text-primary)]">Données collectées :</span>{' '}
                lorsque vous utilisez le formulaire de contact, je peux recueillir votre nom,
                votre adresse e-mail, votre numéro de téléphone, le type de projet, la date et
                le lieu de l'événement (ces trois derniers seulement si vous les renseignez)
                ainsi que votre message. Ces informations sont uniquement utilisées pour
                répondre à votre demande.
              </p>
              <p>
                <span className="font-medium text-[var(--text-primary)]">Finalités :</span>{' '}
                les données sont traitées pour permettre la prise de contact, la préparation
                d’une réponse personnalisée et, si nécessaire, la mise en place d’un projet
                photographique.
              </p>
              <div>
                <p>
                  <span className="font-medium text-[var(--text-primary)]">Prestataires et services tiers :</span>{' '}
                  le site s’appuie sur les services suivants, qui peuvent recevoir votre adresse IP
                  lors de votre visite :
                </p>
                <ul className="mt-2 list-disc space-y-1 pl-5">
                  <li>
                    <span className="text-[var(--text-primary)]">FormSubmit</span> (formsubmit.co,
                    États-Unis) : transmet les messages du formulaire de contact à mon adresse e-mail ;
                  </li>
                  <li>
                    <span className="text-[var(--text-primary)]">Cloudinary</span> (États-Unis) :
                    héberge et diffuse les photographies du site ;
                  </li>
                  <li>
                    <span className="text-[var(--text-primary)]">Google</span> (États-Unis) : fournit,
                    uniquement si vous l’acceptez, l’outil de mesure d’audience Google Tag Manager ;
                  </li>
                  <li>
                    <span className="text-[var(--text-primary)]">GitHub</span> (États-Unis) : héberge
                    le site (voir «&nbsp;Hébergement&nbsp;» ci-dessus).
                  </li>
                </ul>
                <p className="mt-2">
                  Ces prestataires étant établis aux États-Unis, vos données peuvent y être
                  transférées. Aucune donnée personnelle n’est vendue ou cédée à des fins
                  commerciales.
                </p>
              </div>
              <p>
                <span className="font-medium text-[var(--text-primary)]">Cookies et stockage local :</span>{' '}
                ce site n’utilise pas de cookies de suivi publicitaires. Un stockage local de
                votre navigateur est utilisé pour mémoriser votre préférence de thème (clair ou
                sombre) et votre choix concernant les cookies. Google Tag Manager n’est chargé
                qu’après votre accord. Vous pouvez modifier ce choix à tout moment grâce au lien
                «&nbsp;Gérer les cookies&nbsp;» en bas de chaque page.
              </p>
              <p>
                <span className="font-medium text-[var(--text-primary)]">Conservation :</span>{' '}
                les données sont conservées le temps strictement nécessaire au traitement de
                votre demande, puis supprimées ou anonymisées, sauf obligation légale ou besoin
                de conservation pour la preuve d’une relation commerciale.
              </p>
              <p>
                <span className="font-medium text-[var(--text-primary)]">Vos droits :</span>{' '}
                vous pouvez à tout moment demander l’accès, la correction, la suppression ou la
                limitation du traitement de vos données personnelles. Vous pouvez également
                retirer votre consentement ou introduire une réclamation auprès de la CNIL si
                vous estimez que vos droits ne sont pas respectés.
              </p>
              <p>
                <span className="font-medium text-[var(--text-primary)]">Contact :</span>{' '}
                pour exercer vos droits ou pour toute question relative à cette politique,
                vous pouvez me contacter à{' '}
                {/* Souligné : un lien au milieu d'une phrase ne doit pas se
                    distinguer uniquement par sa couleur (accessibilité). */}
                <a
                  href={`mailto:${email}`}
                  className="text-amber-500 underline underline-offset-2 hover:text-amber-400 transition-colors"
                >
                  {email}
                </a>
                .
              </p>
            </div>
          </div>

          {/* Crédits */}
          <div>
            <h2 className="text-2xl font-light text-[var(--text-primary)] mb-4">Crédits</h2>
            <p>Conception et développement du site : {name}.</p>
          </div>
        </div>
      </section>
    </>
  );
}
