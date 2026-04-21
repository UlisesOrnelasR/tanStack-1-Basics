import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/users/$userName/skills/$skillId')({
  component: RouteComponent,
})

function RouteComponent() {

  const {userName, skillId} = Route.useParams()
  return <div>
    <p>Nombre del usuario {userName}</p>
    <p>Skill:  {skillId}</p>
  </div>
}
