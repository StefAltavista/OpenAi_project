import { useEffect } from "react";

export default function Report({
  recipe,
  diet,
  allergies,
  ingredients,
}: {
  recipe?: string;
  diet?: string[];
  allergies?: string[];
  ingredients?: string[];
}) {
  useEffect(() => {});

  return (
    <div className="mt-12 flex flex-col">
      {recipe && (
        <div>
          <h1 className="mb-2 text-[20px] p-2 rounded h-auto bg-blue-100   ">
            Mission: {recipe}
          </h1>
        </div>
      )}
      {diet && (
        <div>
          <h1 className="mb-2 text-[20px] p-2 rounded h-auto bg-blue-100   ">
            Diet: {diet.map((d) => d.toString()).join(" - ")}
          </h1>
        </div>
      )}
      {allergies && (
        <div>
          <h1 className="mb-2 text-[20px] p-2 rounded h-auto bg-blue-100   ">
            Allergies: {allergies.map((a) => a.toString()).join(" - ")}
          </h1>
        </div>
      )}

      {ingredients && (
        <div>
          <div className="mb-2 text-[20px] p-2 rounded h-auto bg-blue-100">
            <h1>Ingredients:</h1>
            {ingredients.map((i, idx) => (
              <p key={idx}>- {i}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
