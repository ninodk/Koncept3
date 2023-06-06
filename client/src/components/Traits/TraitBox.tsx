import Image from "next/image";

interface TraitBoxProps {
  traitName: string;
  image: string;
}
const TraitBox: React.FC<TraitBoxProps> = ({
  traitName,
  image,
}: {
  traitName: string;
  image: string;
}) => {
  return (
    <div className="relative flex items-center w-full p-2 border border-transparent rounded bg-primary xl:p-3 bg-opacity-90">
      <div className="flex-shrink-0 w-8 pr-2">
        <Image src={image} width={16} height={16} alt="trait image"></Image>
      </div>
      <div className="flex flex-col items-start">
        <p className="flex items-center text-xs tracking-wider text-white uppercase ">
          <span className="pt-px">trait</span>
        </p>
        <p className="text-xs font-semibold text-white uppercase">
          {traitName}
        </p>
      </div>
    </div>
  );
};
export default TraitBox;
