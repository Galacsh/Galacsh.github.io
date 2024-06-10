const commonClassName = [
  'leading-tight font-bold mt-12 mb-4',
  '[h1+&]:mt-4',
  '[h2+&]:mt-4',
  '[h3+&]:mt-4',
  '[h4+&]:mt-4',
  '[h5+&]:mt-4',
  '[h6+&]:mt-4',
].join(' ')

export function H6({ children, id }: React.ComponentProps<'h6'>) {
  return (
    <h6 className={`text-[1rem] ${commonClassName}`} id={id}>
      <a className="underline-offset-2 hover:underline" href={`#${id}`}>
        {children}
      </a>
    </h6>
  )
}

export function H5({ children, id }: React.ComponentProps<'h5'>) {
  return (
    <h5 className={`text-[1.125rem] ${commonClassName}`} id={id}>
      <a className="underline-offset-2 hover:underline" href={`#${id}`}>
        {children}
      </a>
    </h5>
  )
}

export function H4({ children, id }: React.ComponentProps<'h4'>) {
  return (
    <h4 className={`text-[1.25rem] ${commonClassName}`} id={id}>
      <a className="underline-offset-2 hover:underline" href={`#${id}`}>
        {children}
      </a>
    </h4>
  )
}

export function H3({ children, id }: React.ComponentProps<'h3'>) {
  return (
    <h3 className={`text-[1.375rem] ${commonClassName}`} id={id}>
      <a className="underline-offset-2 hover:underline" href={`#${id}`}>
        {children}
      </a>
    </h3>
  )
}

export function H2({ children, id }: React.ComponentProps<'h2'>) {
  return (
    <h2 className={`text-[1.5rem] ${commonClassName}`} id={id}>
      <a className="underline-offset-2 hover:underline" href={`#${id}`}>
        {children}
      </a>
    </h2>
  )
}

export function H1({ children, id }: React.ComponentProps<'h1'>) {
  return (
    <h1 className={`text-[1.625rem] ${commonClassName}`} id={id}>
      <a className="underline-offset-2 hover:underline" href={`#${id}`}>
        {children}
      </a>
    </h1>
  )
}