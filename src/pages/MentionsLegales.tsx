import { Mail, Phone, MapPin } from 'lucide-react';
import { useTranslation } from '../lib/i18n';
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

  return (
    <>
      {/* Header */}
      <section className="pt-20 pb-12 px-6 bg-neutral-950">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-amber-500 text-sm tracking-[0.3em] uppercase mb-4">
            Informations légales
          </p>
          <h1 className="text-4xl md:text-5xl font-light mb-4">Mentions Légales</h1>
          <p className="text-neutral-400 max-w-2xl mx-auto">
            Conformément à la loi n°2004-575 du 21 juin 2004 pour la confiance
            dans l'économie numérique.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 px-6 bg-neutral-950">
        <div className="max-w-3xl mx-auto space-y-12 text-neutral-400 leading-relaxed">
          {/* Éditeur du site */}
          <div>
            <h2 className="text-2xl font-light text-white mb-4">Éditeur du site</h2>
            <p>
              Le site <span className="text-neutral-300">stevangaron.fr</span> est édité à
              titre individuel par :
            </p>
            <div className="mt-4 space-y-3 bg-neutral-800/30 rounded-xl p-6 border border-neutral-700/30">
              <p className="text-neutral-200">{name}</p>
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
                <a href={`tel:${phone}`} className="hover:text-amber-500 transition-colors">
                  {phone}
                </a>
              </div>
            </div>
            <p className="mt-4 text-sm text-neutral-500">
              Cette activité de photographie est exercée à titre individuel et n'est, à ce
              jour, rattachée à aucune structure juridique immatriculée (pas de numéro SIRET,
              de numéro RCS, ni de numéro de TVA intracommunautaire).
            </p>
          </div>

          {/* Directeur de la publication */}
          <div>
            <h2 className="text-2xl font-light text-white mb-4">
              Directeur de la publication
            </h2>
            <p>{name}, également éditeur du site (coordonnées ci-dessus).</p>
          </div>

          {/* Hébergement */}
          <div>
            <h2 className="text-2xl font-light text-white mb-4">Hébergement</h2>
            <p>Le site est hébergé par :</p>
            <div className="mt-4 space-y-1 bg-neutral-800/30 rounded-xl p-6 border border-neutral-700/30">
              <p className="text-neutral-200">GitHub, Inc.</p>
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
            <h2 className="text-2xl font-light text-white mb-4">Propriété intellectuelle</h2>
            <p>
              L'ensemble des photographies, textes, logos et éléments graphiques présents sur
              ce site sont la propriété exclusive de {name}, sauf mention contraire. Toute
              reproduction, représentation, modification ou diffusion, totale ou partielle, de
              ce site ou de son contenu, par quelque procédé que ce soit, est interdite sans
              autorisation écrite préalable.
            </p>
          </div>

          {/* Politique de confidentialité */}
          <div>
            <h2 className="text-2xl font-light text-white mb-4">Politique de confidentialité</h2>
            <p>
              Cette politique décrit les informations personnelles collectées sur le site
              <span className="text-neutral-300"> stevangaron.fr</span> et la manière dont
              elles sont utilisées.
            </p>
            <div className="mt-4 space-y-3 text-sm">
              <p>
                <span className="font-medium text-neutral-200">Données collectées :</span>{' '}
                lorsque vous utilisez le formulaire de contact, je peux recueillir votre nom,
                votre adresse e-mail, votre numéro de téléphone (si vous le renseignez), le
                type de projet ainsi que votre message. Ces informations sont uniquement
                utilisées pour répondre à votre demande.
              </p>
              <p>
                <span className="font-medium text-neutral-200">Finalités :</span>{' '}
                les données sont traitées pour permettre la prise de contact, la préparation
                d’une réponse personnalisée et, si nécessaire, la mise en place d’un projet
                photographique.
              </p>
              <p>
                <span className="font-medium text-neutral-200">Prestataires et services tiers :</span>{' '}
                le formulaire peut transmettre vos données à un service externe de gestion
                d’e-mails afin d’assurer l’envoi du message. Aucune donnée personnelle n’est
                vendue ou cédée à des fins commerciales.
              </p>
              <p>
                <span className="font-medium text-neutral-200">Cookies et stockage local :</span>{' '}
                ce site n’utilise pas de cookies de suivi publicitaires. Un stockage local de
                votre navigateur peut toutefois être utilisé pour mémoriser votre préférence de
                thème (clair ou sombre).
              </p>
              <p>
                <span className="font-medium text-neutral-200">Conservation :</span>{' '}
                les données sont conservées le temps strictement nécessaire au traitement de
                votre demande, puis supprimées ou anonymisées, sauf obligation légale ou besoin
                de conservation pour la preuve d’une relation commerciale.
              </p>
              <p>
                <span className="font-medium text-neutral-200">Vos droits :</span>{' '}
                vous pouvez à tout moment demander l’accès, la correction, la suppression ou la
                limitation du traitement de vos données personnelles. Vous pouvez également
                retirer votre consentement ou introduire une réclamation auprès de la CNIL si
                vous estimez que vos droits ne sont pas respectés.
              </p>
              <p>
                <span className="font-medium text-neutral-200">Contact :</span>{' '}
                pour exercer vos droits ou pour toute question relative à cette politique,
                vous pouvez me contacter à{' '}
                <a href={`mailto:${email}`} className="text-amber-500 hover:text-amber-400 transition-colors">
                  {email}
                </a>
                .
              </p>
            </div>
          </div>

          {/* Crédits */}
          <div>
            <h2 className="text-2xl font-light text-white mb-4">Crédits</h2>
            <p>Conception et développement du site : {name}.</p>
          </div>
        </div>
      </section>
    </>
  );
}
