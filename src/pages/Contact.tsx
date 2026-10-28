import { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';
import { toTelHref } from '../lib/phone';
import type { Profile } from '../lib/types';

interface ContactProps {
  profile: Profile | null;
}

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  projectType: string;
  eventDate: string;
  eventLocation: string;
  message: string;
}

// Types de projet proposés dans le formulaire (valeur envoyée, texte affiché)
const PROJECT_TYPES = [
  { value: 'mariage', label: 'Mariage' },
  { value: 'sport', label: 'Sport' },
  { value: 'evenement', label: 'Événement (concert, gala, fête…)' },
  { value: 'portrait', label: 'Portrait' },
  { value: 'drone', label: 'Drone / prise de vue aérienne' },
  { value: 'paysage', label: 'Paysage' },
  { value: 'autre', label: 'Autre' },
];

const DEFAULT_EMAIL = 'stevan.garon@gmail.com';

// Lien qui ouvre la messagerie du visiteur avec un e-mail déjà rempli : son
// message et ses coordonnées. Proposé quand l'envoi par le formulaire échoue
// (service d'envoi en panne, connexion coupée...), pour qu'aucune demande ne
// se perde.
function buildMailtoHref(recipient: string, data: ContactFormData): string {
  const projectLabel = PROJECT_TYPES.find((type) => type.value === data.projectType)?.label;
  const lines = [
    data.message.trim().replace(/\r?\n/g, '\r\n'),
    '',
    '---',
    `Nom : ${data.name.trim()}`,
    `E-mail : ${data.email.trim()}`,
    data.phone.trim() ? `Téléphone : ${data.phone.trim()}` : '',
    projectLabel ? `Type de projet : ${projectLabel}` : '',
    data.eventDate.trim() ? `Date : ${data.eventDate.trim()}` : '',
    data.eventLocation.trim() ? `Lieu : ${data.eventLocation.trim()}` : '',
  ].filter((line, index) => index < 3 || line !== '');
  const subject = `Demande depuis le site${data.name.trim() ? ` - ${data.name.trim()}` : ''}`;
  // Retours à la ligne au format \r\n, celui attendu dans un lien mailto.
  return `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\r\n'))}`;
}

const initialFormData: ContactFormData = {
  name: '',
  email: '',
  phone: '',
  projectType: '',
  eventDate: '',
  eventLocation: '',
  message: '',
};

export function Contact({ profile }: ContactProps) {
  const [submitted, setSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // true quand le service d'envoi a échoué : on propose alors l'envoi par e-mail
  const [sendFailed, setSendFailed] = useState(false);
  const [formData, setFormData] = useState<ContactFormData>(initialFormData);
  // Champ piège invisible : seuls les robots de spam le remplissent. C'est la
  // protection anti-spam du formulaire (l'ancien code reCAPTCHA, jamais
  // activé, a été retiré).
  const [honeypot, setHoneypot] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSendFailed(false);

    // Champ piège rempli = robot : on fait comme si l'envoi avait réussi,
    // sans rien envoyer.
    if (honeypot.trim() !== '') {
      setSubmitted(true);
      setFormData(initialFormData);
      setHoneypot('');
      return;
    }

    const trimmedName = formData.name.trim();
    const trimmedEmail = formData.email.trim();
    const trimmedPhone = formData.phone.trim();
    const trimmedProjectType = formData.projectType.trim();
    const trimmedEventDate = formData.eventDate.trim();
    const trimmedEventLocation = formData.eventLocation.trim();
    const trimmedMessage = formData.message.trim();

    if (!trimmedName || !trimmedEmail || !trimmedMessage) {
      setError('Veuillez renseigner votre nom, votre email et votre message.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setError('Veuillez saisir une adresse e-mail valide.');
      return;
    }

    if (trimmedPhone && !/^[0-9\s+().-]{4,20}$/.test(trimmedPhone)) {
      setError('Veuillez saisir un numéro de téléphone valide.');
      return;
    }

    if (trimmedMessage.length > 2000) {
      setError('Votre message est trop long. Veuillez limiter votre demande à 2000 caractères.');
      return;
    }

    setIsSending(true);

    try {
      const recipientEmail = profile?.email || DEFAULT_EMAIL;
      const response = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(recipientEmail)}`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: trimmedName,
          email: trimmedEmail,
          phone: trimmedPhone,
          projectType: trimmedProjectType,
          eventDate: trimmedEventDate,
          eventLocation: trimmedEventLocation,
          message: trimmedMessage,
          recipientEmail,
          source: 'site-web',
          _subject: `Nouveau message depuis le site - ${trimmedName}`,
          _captcha: 'false',
          _template: 'table',
          _honeypot: honeypot,
        }),
      });

      if (!response.ok) {
        throw new Error('Le service d’envoi a refusé la requête.');
      }

      setSubmitted(true);
      setFormData(initialFormData);
      setHoneypot('');
    } catch (err) {
      console.error('Contact form error:', err);
      // Le message tapé est conservé dans le formulaire : le visiteur peut
      // réessayer, ou l'envoyer depuis sa messagerie avec le bouton proposé.
      setSendFailed(true);
      setError('L’envoi du message a échoué. Vous pouvez réessayer, ou m’envoyer le même message depuis votre messagerie :');
    } finally {
      setIsSending(false);
    }
  };

  // Style des champs : les couleurs viennent des variables du thème
  // (--field-bg, --field-border... dans index.css), qui changent toutes seules
  // entre clair et sombre. Plus besoin de suivre le thème dans ce composant.
  const fieldClassName =
    'w-full border rounded-lg px-4 py-3 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 transition-colors bg-[var(--field-bg)] border-[var(--field-border)] text-[var(--text-primary)] placeholder:text-[var(--field-placeholder)]';

  return (
    <>
      {/* Header */}
      <section className="pt-20 pb-12 px-6 bg-neutral-950">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-amber-500 text-sm tracking-[0.3em] uppercase mb-4">
            Contact
          </p>
          <h1 className="text-4xl md:text-5xl font-light mb-4">Travaillons ensemble</h1>
          <p className="text-neutral-400 max-w-2xl mx-auto">
            Disponible pour vos projets photographiques. N'hésitez pas à me
            contacter pour discuter de vos besoins.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-16 px-6 bg-neutral-950">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-light mb-4">
                  Parlons de votre projet
                </h2>
                <p className="text-neutral-400 leading-relaxed">
                  Que vous ayez besoin d'un portrait, d'une couverture d'événement,
                  ou de photos artistiques, je suis là pour créer avec vous des
                  images qui vous ressemblent.
                </p>
              </div>

              <div className="space-y-4">
                <a
                  href={`mailto:${profile?.email || DEFAULT_EMAIL}`}
                  className="flex items-center gap-4 p-5 bg-neutral-800/30 rounded-xl hover:bg-neutral-800/50 transition-colors group border border-neutral-700/30"
                >
                  <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center group-hover:bg-amber-500 transition-colors">
                    <Mail className="w-5 h-5 text-amber-500 group-hover:text-neutral-950" />
                  </div>
                  <div>
                    <p className="text-neutral-500 text-sm">Email</p>
                    <p className="text-theme-primary">{profile?.email || 'stevan.garon@gmail.com'}</p>
                  </div>
                </a>

                {profile?.phone && (
                  <a
                    href={toTelHref(profile.phone)}
                    className="flex items-center gap-4 p-5 bg-neutral-800/30 rounded-xl hover:bg-neutral-800/50 transition-colors group border border-neutral-700/30"
                  >
                    <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center group-hover:bg-amber-500 transition-colors">
                      <Phone className="w-5 h-5 text-amber-500 group-hover:text-neutral-950" />
                    </div>
                    <div>
                      <p className="text-neutral-500 text-sm">Téléphone</p>
                      <p className="text-theme-primary">{profile.phone}</p>
                    </div>
                  </a>
                )}

                <div className="flex items-center gap-4 p-5 bg-neutral-800/30 rounded-xl border border-neutral-700/30">
                  <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-neutral-500 text-sm">Localisation</p>
                    <p className="text-theme-primary">{profile?.location || 'La Chaize-le-Vicomte'}</p>
                  </div>
                </div>
              </div>

              {/* Zone d'intervention : remplace l'ancienne carte Google Maps
                  intégrée, qui se chargeait avant tout consentement (et
                  transmettait l'adresse IP des visiteurs à Google). Un simple
                  lien ouvre Google Maps seulement si la personne le souhaite. */}
              <div className="p-5 bg-neutral-800/30 rounded-xl border border-neutral-700/30">
                <p className="text-neutral-500 text-sm mb-1">Zone d'intervention</p>
                <p className="text-theme-primary leading-relaxed">
                  La Chaize-le-Vicomte, La Roche-sur-Yon, Fontenay-le-Comte et toute la Vendée.
                  Déplacements possibles au-delà sur demande.
                </p>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=La+Chaize-le-Vicomte%2C+Vend%C3%A9e"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1.5 text-sm text-amber-500 hover:text-amber-400 transition-colors"
                >
                  Voir sur Google Maps
                  <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                </a>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-neutral-800/20 rounded-2xl p-8 border border-neutral-700/30">
              {submitted ? (
                <div
                  role="status"
                  aria-live="polite"
                  className="h-full flex flex-col items-center justify-center text-center"
                >
                  <CheckCircle className="w-16 h-16 text-green-500 mb-4" aria-hidden="true" />
                  {/* text-theme-primary au lieu de text-white : en mode clair,
                      le titre blanc était invisible sur le fond clair. */}
                  <h3 className="text-2xl font-light text-theme-primary mb-2">
                    Message envoyé !
                  </h3>
                  <p className="text-neutral-400">
                    Merci pour votre message. J’ai bien reçu votre demande et je vous réponds sous 24 h pour en discuter.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="mt-6 text-sm text-amber-500 underline underline-offset-4 hover:text-amber-400 transition-colors"
                  >
                    Envoyer un autre message
                  </button>
                </div>
              ) : (
                <>
                  <h3 className="text-2xl font-light mb-6">
                    Envoyez un message
                  </h3>
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div
                      aria-hidden="true"
                      style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', overflow: 'hidden' }}
                    >
                      <label htmlFor="website">Ne pas remplir ce champ</label>
                      <input
                        type="text"
                        id="website"
                        name="website"
                        tabIndex={-1}
                        autoComplete="off"
                        value={honeypot}
                        onChange={(e) => setHoneypot(e.target.value)}
                      />
                    </div>
                    <div>
                      <label htmlFor="contact-name" className="block text-sm text-neutral-400 mb-2">
                        Votre nom
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={fieldClassName}
                        placeholder="Jean Dupont"
                        required
                        maxLength={100}
                        autoComplete="name"
                      />
                    </div>
                    <div>
                      <label htmlFor="contact-email" className="block text-sm text-neutral-400 mb-2">
                        Votre email
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={fieldClassName}
                        placeholder="jean@example.com"
                        required
                        maxLength={254}
                        autoComplete="email"
                      />
                    </div>
                    <div>
                      <label htmlFor="contact-phone" className="block text-sm text-neutral-400 mb-2">
                        Votre téléphone (optionnel)
                      </label>
                      <input
                        id="contact-phone"
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={fieldClassName}
                        placeholder="06 12 34 56 78"
                        maxLength={20}
                        autoComplete="tel"
                      />
                    </div>
                    <div>
                      <label htmlFor="contact-project-type" className="block text-sm text-neutral-400 mb-2">
                        Type de projet
                      </label>
                      <select
                        id="contact-project-type"
                        name="projectType"
                        value={formData.projectType}
                        onChange={handleChange}
                        className={`contact-select ${fieldClassName}`}
                      >
                        <option value="">Sélectionnez un type</option>
                        {PROJECT_TYPES.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="grid gap-5 sm:grid-cols-2">
                      <div>
                        <label htmlFor="contact-event-date" className="block text-sm text-neutral-400 mb-2">
                          Date (optionnel)
                        </label>
                        <input
                          id="contact-event-date"
                          type="date"
                          name="eventDate"
                          value={formData.eventDate}
                          onChange={handleChange}
                          className={fieldClassName}
                        />
                      </div>
                      <div>
                        <label htmlFor="contact-event-location" className="block text-sm text-neutral-400 mb-2">
                          Lieu (optionnel)
                        </label>
                        <input
                          id="contact-event-location"
                          type="text"
                          name="eventLocation"
                          value={formData.eventLocation}
                          onChange={handleChange}
                          className={fieldClassName}
                          placeholder="La Roche-sur-Yon"
                          maxLength={120}
                          autoComplete="address-level2"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="contact-message" className="block text-sm text-neutral-400 mb-2">
                        Votre message
                      </label>
                      <textarea
                        id="contact-message"
                        name="message"
                        rows={5}
                        value={formData.message}
                        onChange={handleChange}
                        className={`${fieldClassName} resize-none`}
                        placeholder="Décrivez votre projet..."
                        required
                        maxLength={2000}
                      />
                    </div>
                    {error && (
                      <div
                        role="alert"
                        aria-live="assertive"
                        className="flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300"
                      >
                        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                        <div>
                          <p>{error}</p>
                          {sendFailed && (
                            <a
                              href={buildMailtoHref(profile?.email || DEFAULT_EMAIL, formData)}
                              className="mt-3 inline-flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 font-medium text-neutral-950 hover:bg-amber-400 transition-colors"
                            >
                              <Mail className="h-4 w-4" aria-hidden="true" />
                              Envoyer par e-mail
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                    <button
                      type="submit"
                      disabled={isSending}
                      className="w-full bg-amber-500 text-neutral-950 py-4 rounded-lg font-medium hover:bg-amber-400 transition-colors flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      <span>{isSending ? 'Envoi en cours...' : 'Envoyer'}</span>
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}