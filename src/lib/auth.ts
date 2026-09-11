export type Role = 'owner' | 'jpj' | 'mot' | 'student'

export interface User {
  id: string
  name: string
  email: string
  role: Role
  password: string
}

export const ROLE_LABEL: Record<Role, string> = {
  owner: 'Vehicle owner',
  jpj: 'JPJ officer',
  mot: 'MOT analyst',
  student: 'COS30049 student',
}

export function isOwner(role: Role) {
  return role === 'owner'
}

export function homePath(role: Role) {
  return isOwner(role) ? '/user/welcome' : '/app/welcome'
}

const USERS_KEY = 'jpj-insight-users'
const SESSION_KEY = 'jpj-insight-session'

const DEMOS: User[] = [
  {
    id: 'demo-owner',
    name: 'Hafiz Tan',
    email: 'user@jpjinsight.my',
    role: 'owner',
    password: 'myvehicle',
  },
  {
    id: 'demo-jpj',
    name: 'Aina Rahman',
    email: 'analyst@jpj.gov.my',
    role: 'jpj',
    password: 'jpjinsight',
  },
]

function readUsers(): User[] {
  const raw = localStorage.getItem(USERS_KEY)
  const existing = raw ? (JSON.parse(raw) as User[]) : []
  let changed = false
  let users = existing.map((u) =>
    u.role === ('user' as Role) ? { ...u, role: 'owner' as Role } : u,
  )
  for (const demo of DEMOS) {
    if (!users.some((u) => u.email === demo.email)) {
      users = [demo, ...users]
      changed = true
    }
  }
  if (!raw || changed) localStorage.setItem(USERS_KEY, JSON.stringify(users))
  return users
}

function writeUsers(users: User[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export function getSessionEmail() {
  return localStorage.getItem(SESSION_KEY)
}

export function findUser(email: string) {
  return readUsers().find((u) => u.email.toLowerCase() === email.toLowerCase())
}

export function loginUser(email: string, password: string) {
  const user = findUser(email)
  if (!user || user.password !== password) {
    throw new Error('Email or password is incorrect.')
  }
  localStorage.setItem(SESSION_KEY, user.email)
  return user
}

export function registerUser(input: Omit<User, 'id'>) {
  const users = readUsers()
  if (users.some((u) => u.email.toLowerCase() === input.email.toLowerCase())) {
    throw new Error('An account with this email already exists.')
  }
  const user: User = { ...input, id: crypto.randomUUID() }
  writeUsers([...users, user])
  localStorage.setItem(SESSION_KEY, user.email)
  return user
}

export function logoutUser() {
  localStorage.removeItem(SESSION_KEY)
}

export function currentUser() {
  const email = getSessionEmail()
  if (!email) return null
  return findUser(email) ?? null
}
