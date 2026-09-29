import { Fragment } from "react";
import type { PostalAddress as PostalAddressConfig } from "@/config/types";
import { formatAddress } from "@/lib/site";

/** Adresse sur plusieurs segments insécables : se replie proprement à toute largeur, même avec le texte agrandi. */
export function PostalAddress({ address }: { address: PostalAddressConfig }) {
  const { streetParts, locality } = formatAddress(address);
  return (
    <address className="not-italic">
      {streetParts.map((part) => (
        <Fragment key={part}>
          <span className="inline-block">{part},</span>{" "}
        </Fragment>
      ))}
      <span className="inline-block">{locality}</span>
    </address>
  );
}
