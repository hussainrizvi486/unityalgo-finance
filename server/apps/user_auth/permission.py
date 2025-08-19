import datetime
from .models import RolePolicy


def check_permission(user, action, resource: dict, env: dict = None):
    if env is None:
        now = datetime.datetime.now()
        env = {"hour": now.hour, "weekday": now.weekday()}

    user_data = {
        "id": user.id,
        "username": user.username,
        "email": user.email,
    }

    roles = [ur.role for ur in user.user_roles.select_related("role")]
    policies = RolePolicy.objects.filter(role__in=roles, action=action)

    for policy in policies:
        try:
            # NOTE: In production, replace eval with safe expression parser
            if eval(
                policy.condition,
                {},
                {"user": user_data, "resource": resource, "env": env},
            ):
                return True
        except Exception as e:
            print(f"Policy evaluation error: {e}")

    return False
