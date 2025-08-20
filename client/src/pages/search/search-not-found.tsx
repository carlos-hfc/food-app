export function SearchNotFound() {
  return (
    <div className="flex items-center justify-center flex-col gap-4 w-full col-span-full">
      <img
        src="/search-not-found.svg"
        alt="Busca não encontrada"
        className="max-w-full md:max-w-96"
      />

      <div className="text-center space-y-2">
        <p className="text-xl font-bold">Nenhum resultado encontrado</p>

        <p className="text-sm text-balance">
          Edite ou limpe os filtros para voltar
        </p>
      </div>
    </div>
  )
}
