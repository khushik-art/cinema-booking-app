import { useNavigate } from "react-router-dom";

const MovieCard = ({id, title, image}) => {
  const navigate = useNavigate();
  return (
    <div className="w-[220px] flex flex-col items-center gap-3 cursor-pointer">
      
      {/* Poster */}
      <div 
        onClick={() =>{ 
          console.log({id, title, image});
          navigate(`/movie/${id}`)
        }}
        className="w-full h-[320px] rounded-2xl overflow-hidden shadow-md hover:scale-105 transition">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Title */}
      <p className="text-sm font-medium text-sky-600">
        {title}
      </p>

    </div>
  );
};

export default MovieCard;