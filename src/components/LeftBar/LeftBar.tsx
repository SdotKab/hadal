import menuList from '@/utils/links'
import NextImage from 'next/image'
import Image from '../Media/Image'
import Link from 'next/link'
import React from 'react'

const LeftBar = () => {
  return (
    <div className="h-screen sticky top-0 flex flex-col justify-between pt-2 pb-8">
      {/* LOGO MENU BUTTON */}
      <div className="flex flex-col gap-4 text-lg items-center xxl:items-start">
        {/* LOGO */}
        <Link href="/" className="p-2 rounded-full hover:bg-[#181818] ">
          {/* <Image path="icons/hadal4.svg" alt="logo" w={24} h={24} /> */}
          <NextImage src="icons/hadal4.svg" alt="logo" width={30} height={30} />
        </Link>
        {/* MENU LIST */}
        {/* USER */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 relative rounded-full overflow-hidden">
              <Image path="/general/otterinsuit2.jpg" alt="s.kab" w={80} h={80} tr={true} />
            </div>
            <Link href={`/skab`}>
                <div className="hidden xxl:flex flex-col">
                  <span className="font-bold">S.Kab</span>
                  <span className="text-sm text-textGray">@S.Kab</span>
                </div>
            </Link>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          {menuList.map((item) => (
            <Link
              href={item.link}
              className="p-2 rounded-full hover:bg-[#181818] flex items-center gap-4"
              key={item.id}
            >
              <NextImage
                src={`icons/${item.icon}`}
                alt={item.name}
                width={24}
                height={24}
              />

              <span className="hidden xxl:inline">{item.name}</span>
            </Link>
          ))}
        </div>
        {/* BUTTON */}
        <Link
          href="/compose/post"
          className="bg-white text-black rounded-full w-12 h-12 flex items-center justify-center xxl:hidden"
        >
          <Image path="icons/post.svg" alt="new post" w={24} h={24} />

        </Link>
        <Link
          href="/compose/post"
          className="hidden xxl:block bg-white text-black rounded-full font-bold py-2 px-20"
        >
          Post
        </Link>
      </div>
    </div>
  )
}

export default LeftBar