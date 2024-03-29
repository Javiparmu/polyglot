import Image from 'next/image';

interface FlagProps {
  language: string;
  className?: string;
}

const Flag = ({ language, className }: FlagProps) => {
  return (
    <Image
      className={className}
      src={`https://unpkg.com/language-icons/icons/${language}.svg`}
      alt={language}
      width={24}
      height={18}
    />
  );
};

export default Flag;
