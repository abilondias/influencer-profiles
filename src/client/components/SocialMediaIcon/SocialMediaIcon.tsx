import { FC } from "react"

const iconClasses = {
  tiktok: "bi bi-tiktok",
  instagram: "bi bi-instagram",
} as const

type IconKey = keyof typeof iconClasses

/**
 *  Key for the icon class
 */
type IconProps = {
  slug: IconKey | (string & {}) // suggested in autocomplete but not enforced
}

export const SocialMediaIcon: FC<IconProps> = ({ slug }) => {
  const iconClass = iconClasses[slug as IconKey]

  if (!iconClass) {
    return
  }

  return <i className={iconClass}></i>
}
