import Image from 'next/image'
import { siteConfig } from 'app/config'

export function AuthorProfile() {
  const { name, nickname, bio, avatar, test } = siteConfig.author

  return (
    <div className="mt-16 pt-8 border-t border-neutral-200 dark:border-neutral-800">
      <div className="flex items-center gap-4">
        <Image
          src={avatar}
          alt={name}
          width={64}
          height={64}
          className="rounded-full"
        />
        <div>
          <p className="font-semibold text-neutral-900 dark:text-neutral-100">
            {name} Sir
          </p>
          <p className="text-sm italic text-neutral-500 dark:text-neutral-400">
            {nickname}
          </p>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            {bio}
          </p>
        </div>
      </div>
    </div>
  )
}
