function Card({ title, description, value }) {
  return (
    <article className="h-full rounded-lg border border-leaf-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-leaf-200 dark:hover:border-gray-600 hover:shadow-soft">
      {value && <p className="mb-3 text-3xl font-bold text-leaf-700 dark:text-leaf-400">{value}</p>}
      <h3 className="text-xl font-semibold text-leaf-900 dark:text-leaf-50">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">{description}</p>
    </article>
  );
}

export default Card;
