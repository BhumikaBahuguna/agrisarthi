function Card({ title, description, value }) {
  return (
    <article className="h-full rounded-lg border border-leaf-100 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-leaf-200 hover:shadow-soft">
      {value && <p className="mb-3 text-3xl font-bold text-leaf-700">{value}</p>}
      <h3 className="text-xl font-semibold text-leaf-900">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
    </article>
  );
}

export default Card;
